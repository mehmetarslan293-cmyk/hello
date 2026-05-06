import { NextResponse } from "next/server";
import { CampaignStatus, Role } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { getBrandProfileForUser, requireSession } from "@/lib/server/apiAuth";

export async function GET() {
  try {
    const { session, response } = await requireSession([Role.BRAND]);
    if (!session?.user?.id || response) return response!;

    const brand = await getBrandProfileForUser(session.user.id);
    if (!brand) {
      return NextResponse.json({ error: "Marka profili bulunamadi" }, { status: 404 });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
      select: { balance: true },
    });

    if (!wallet) {
      return NextResponse.json({ error: "Marka cuzdani bulunamadi" }, { status: 404 });
    }

    const pendingPaid = await prisma.campaign.aggregate({
      where: {
        brandId: brand.id,
        status: CampaignStatus.DRAFT,
        campaignType: "Ucretli teklif",
      },
      _sum: { budgetTotal: true },
    });

    const blockedAmount = pendingPaid._sum.budgetTotal ?? 0;
    const walletBalance = wallet.balance;
    const availableBalance = Math.max(0, walletBalance - blockedAmount);

    return NextResponse.json({
      ok: true,
      walletBalance,
      blockedAmount,
      availableBalance,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Teklif bakiyesi alinamadi", detail: String(error) },
      { status: 500 },
    );
  }
}
