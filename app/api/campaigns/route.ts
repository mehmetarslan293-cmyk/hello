import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { CampaignStatus, Role } from "@prisma/client";
import { getBrandProfileForUser, requireSession } from "@/lib/server/apiAuth";

type CampaignBody = {
  brandId?: string;
  title: string;
  campaignType: string;
  budgetTotal: number;
  objective?: string;
  description?: string;
  status?: CampaignStatus;
  targetAgeRange?: string;
  targetGender?: string;
  targetCountry?: string;
  targetCity?: string;
  targetPlatforms?: string;
};

function readDetail(description: string | undefined, key: string) {
  if (!description) return null;
  const line = description.split("\n").find((x) => x.startsWith(`${key}:`));
  return line ? line.slice(key.length + 1).trim() : null;
}

export async function GET(req: Request) {
  const { session, response } = await requireSession([Role.BRAND]);
  if (!session?.user?.id || response) return response!;

  const brand = await getBrandProfileForUser(session.user.id);
  if (!brand) {
    return NextResponse.json({ ok: true, campaigns: [] });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as CampaignStatus | null;

  const rows = await prisma.campaign.findMany({
    where: {
      brandId: brand.id,
      status: status ?? undefined,
    },
    orderBy: { createdAt: "desc" },
    include: {
      applications: true,
    },
  });

  return NextResponse.json({ ok: true, campaigns: rows });
}

export async function POST(req: Request) {
  try {
    const { session, response } = await requireSession([Role.BRAND]);
    if (!session?.user?.id || response) return response!;

    const brand = await getBrandProfileForUser(session.user.id);
    if (!brand) {
      return NextResponse.json({ error: "Marka profili bulunamadı" }, { status: 400 });
    }

    const body = (await req.json()) as CampaignBody;
    const hasValidBudget =
      typeof body.budgetTotal === "number" &&
      Number.isFinite(body.budgetTotal) &&
      body.budgetTotal >= 0;
    if (!body.title || !body.campaignType || !hasValidBudget) {
      return NextResponse.json({ error: "Eksik alanlar" }, { status: 400 });
    }

    if (body.brandId && body.brandId !== brand.id) {
      return NextResponse.json({ error: "Yetkisiz marka kimligi" }, { status: 403 });
    }

    const resolvedBrandId = brand.id;

    const offerType = readDetail(body.description, "OFFER_TYPE");
    let offerBalance: { walletBalance: number; blockedAmount: number; availableBalance: number } | null = null;

    if (offerType === "ucretli") {
      const brandWithWallet = await prisma.brandProfile.findUnique({
        where: { id: resolvedBrandId },
        select: {
          userId: true,
          user: {
            select: {
              wallet: {
                select: { balance: true },
              },
            },
          },
        },
      });
      if (!brandWithWallet?.user?.wallet) {
        return NextResponse.json({ error: "Marka cuzdani bulunamadi" }, { status: 400 });
      }

      const pendingPaid = await prisma.campaign.aggregate({
        where: {
          brandId: resolvedBrandId,
          status: CampaignStatus.DRAFT,
          campaignType: "Ucretli teklif",
        },
        _sum: { budgetTotal: true },
      });
      const blockedAmount = pendingPaid._sum.budgetTotal ?? 0;
      const walletBalance = brandWithWallet.user.wallet.balance;
      const available = walletBalance - blockedAmount;
      if (body.budgetTotal > available) {
        return NextResponse.json(
          {
            error: "Yetersiz kullanilabilir bakiye",
            availableBalance: available,
            blockedAmount,
            walletBalance: brandWithWallet.user.wallet.balance,
          },
          { status: 400 },
        );
      }
      offerBalance = {
        walletBalance,
        blockedAmount: blockedAmount + body.budgetTotal,
        availableBalance: Math.max(0, available - body.budgetTotal),
      };
    }

    const campaign = await prisma.campaign.create({
      data: {
        brandId: resolvedBrandId,
        title: body.title,
        campaignType: body.campaignType,
        budgetTotal: body.budgetTotal,
        objective: body.objective,
        description: body.description,
        status: body.status ?? CampaignStatus.DRAFT,
        targetAgeRange: body.targetAgeRange,
        targetGender: body.targetGender,
        targetCountry: body.targetCountry,
        targetCity: body.targetCity,
        targetPlatforms: body.targetPlatforms,
      },
    });

    return NextResponse.json({ ok: true, campaign, offerBalance });
  } catch (error) {
    return NextResponse.json({ error: "Kampanya oluşturulamadı", detail: String(error) }, { status: 500 });
  }
}
