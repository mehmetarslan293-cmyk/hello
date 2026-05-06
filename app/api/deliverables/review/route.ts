import { NextResponse } from "next/server";
import { DeliverableStatus, FinancialTxnType, Role } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { requireSession } from "@/lib/server/apiAuth";

type Body = {
  deliverableId: string;
  action: "approve" | "revision" | "rate";
  note?: string;
  rating?: number;
};

export async function POST(req: Request) {
  try {
    const { session, response } = await requireSession([Role.BRAND]);
    if (!session?.user?.id || response) return response!;

    const body = (await req.json()) as Body;
    if (!body.deliverableId || !body.action) {
      return NextResponse.json({ error: "deliverableId ve action zorunlu" }, { status: 400 });
    }

    const deliverableBase = await prisma.deliverable.findUnique({
      where: { id: body.deliverableId },
      include: {
        campaign: {
          select: {
            brand: { select: { userId: true } },
          },
        },
      },
    });
    if (!deliverableBase) {
      return NextResponse.json({ error: "Icerik bulunamadi" }, { status: 404 });
    }
    if (deliverableBase.campaign.brand.userId !== session.user.id) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
    }

    if (body.action === "rate") {
      const deliverable = await prisma.deliverable.findUnique({
        where: { id: body.deliverableId },
        select: { id: true, status: true, brandRating: true },
      });
      if (!deliverable) {
        return NextResponse.json({ error: "Icerik bulunamadi" }, { status: 404 });
      }
      if (deliverable.status !== DeliverableStatus.APPROVED) {
        return NextResponse.json({ error: "Yıldız sadece kabul edilen iceriklere verilebilir" }, { status: 400 });
      }

      const safeRating = Math.max(1, Math.min(5, Number.isFinite(body.rating) ? Number(body.rating) : 5));

      const updated = await prisma.$transaction(async (tx) => {
        const d = await tx.deliverable.update({
          where: { id: body.deliverableId },
          data: {
            brandRating: safeRating,
            ratedAt: new Date(),
            ratedByUserId: session.user.id,
          },
        });
        await tx.deliverableRatingLog.create({
          data: {
            deliverableId: d.id,
            rating: safeRating,
            actorUserId: session.user.id,
            note: body.note?.trim() || null,
          },
        });
        await tx.auditLog.create({
          data: {
            actorUserId: session.user.id,
            action: "DELIVERABLE_RATE",
            entity: "Deliverable",
            entityId: d.id,
            detail: JSON.stringify({ rating: safeRating }),
          },
        });
        return d;
      });

      return NextResponse.json({ ok: true, deliverable: updated });
    }

    const nextStatus =
      body.action === "approve" ? DeliverableStatus.APPROVED : DeliverableStatus.REVISION_REQUESTED;
    const noteText = body.note?.trim() || "";
    const ratingValue =
      body.action === "approve"
        ? Math.max(1, Math.min(5, Number.isFinite(body.rating) ? Number(body.rating) : 5))
        : null;

    const deliverable = await prisma.deliverable.findUnique({
      where: { id: body.deliverableId },
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
            budgetSpent: true,
            brand: {
              select: {
                userId: true,
                user: {
                  select: {
                    wallet: {
                      select: { id: true, balance: true, escrowBalance: true },
                    },
                  },
                },
              },
            },
          },
        },
        influencer: {
          select: {
            user: {
              select: {
                wallet: {
                  select: { id: true, balance: true, escrowBalance: true },
                },
              },
            },
          },
        },
      },
    });
    if (!deliverable) {
      return NextResponse.json({ error: "Icerik bulunamadi" }, { status: 404 });
    }
    if (deliverable.campaign.brand.userId !== session.user.id) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
    }

    const brandWallet = deliverable.campaign.brand.user.wallet;
    const influencerWallet = deliverable.influencer.user.wallet;

    let payout = 0;
    if (body.action === "approve") {
      const acceptedApp = await prisma.campaignApplication.findFirst({
        where: {
          campaignId: deliverable.campaignId,
          influencerId: deliverable.influencerId,
        },
        orderBy: { updatedAt: "desc" },
        select: { offeredPrice: true },
      });
      payout = acceptedApp?.offeredPrice ?? 0;
    }

    const releaseReference = `deliverable:${deliverable.id}`;
    const existingRelease =
      body.action === "approve" && influencerWallet
        ? await prisma.financialTransaction.findFirst({
            where: {
              walletId: influencerWallet.id,
              type: FinancialTxnType.CAMPAIGN_ESCROW_RELEASE,
              referenceId: releaseReference,
            },
            select: { id: true },
          })
        : null;

    const updated = await prisma.$transaction(async (tx) => {
      const updatedDeliverable = await tx.deliverable.update({
        where: { id: body.deliverableId },
        data: {
          status: nextStatus,
          reviewNote: body.action === "approve" ? (noteText || null) : noteText || null,
          brandRating: body.action === "approve" ? ratingValue : undefined,
          ratedAt: body.action === "approve" ? new Date() : undefined,
          ratedByUserId: body.action === "approve" ? session.user.id : undefined,
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: session.user.id,
          action: body.action === "approve" ? "DELIVERABLE_APPROVE" : "DELIVERABLE_REVISION",
          entity: "Deliverable",
          entityId: deliverable.id,
          detail: JSON.stringify({
            status: nextStatus,
            rating: body.action === "approve" ? ratingValue : null,
            note: noteText || null,
          }),
        },
      });

      if (body.action === "approve" && ratingValue) {
        await tx.deliverableRatingLog.create({
          data: {
            deliverableId: deliverable.id,
            rating: ratingValue,
            actorUserId: session.user.id,
            note: noteText || null,
          },
        });
      }

      const shouldTransfer =
        body.action === "approve" &&
        payout > 0 &&
        !existingRelease &&
        Boolean(brandWallet) &&
        Boolean(influencerWallet);

      if (!shouldTransfer || !brandWallet || !influencerWallet) {
        return updatedDeliverable;
      }

      if (brandWallet.balance < payout) {
        throw new Error("Marka bakiyesi yetersiz, transfer gerceklestirilemedi");
      }

      const brandBalanceAfter = brandWallet.balance - payout;
      const brandEscrowAfter = Math.max(0, brandWallet.escrowBalance - payout);
      const influencerBalanceAfter = influencerWallet.balance + payout;

      await Promise.all([
        tx.wallet.update({
          where: { id: brandWallet.id },
          data: {
            balance: brandBalanceAfter,
            escrowBalance: brandEscrowAfter,
          },
        }),
        tx.wallet.update({
          where: { id: influencerWallet.id },
          data: {
            balance: influencerBalanceAfter,
          },
        }),
        tx.campaign.update({
          where: { id: deliverable.campaign.id },
          data: {
            budgetSpent: { increment: payout },
          },
        }),
      ]);

      await tx.financialTransaction.createMany({
        data: [
          {
            walletId: brandWallet.id,
            type: FinancialTxnType.CAMPAIGN_ESCROW_RELEASE,
            amount: -payout,
            balanceAfter: brandBalanceAfter,
            referenceId: releaseReference,
            note: `Icerik onayi sonrasi influencer odemesi: ${deliverable.campaign.title}`,
          },
          {
            walletId: influencerWallet.id,
            type: FinancialTxnType.CAMPAIGN_ESCROW_RELEASE,
            amount: payout,
            balanceAfter: influencerBalanceAfter,
            referenceId: releaseReference,
            note: `Marka onayi sonrasi odeme: ${deliverable.campaign.title}`,
          },
        ],
      });

      return updatedDeliverable;
    });

    return NextResponse.json({ ok: true, deliverable: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Icerik degerlendirmesi kaydedilemedi", detail: String(error) },
      { status: 500 },
    );
  }
}
