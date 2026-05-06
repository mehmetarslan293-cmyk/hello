import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { Role } from "@prisma/client";
import { requireSession } from "@/lib/server/apiAuth";

export async function GET() {
  try {
    const { session, response } = await requireSession([Role.BRAND]);
    if (!session?.user?.id || response) return response!;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        brandProfile: {
          include: {
            campaigns: {
              orderBy: { createdAt: "desc" },
              take: 5,
            },
          },
        },
      },
    });

    if (!user || user.role !== Role.BRAND || !user.brandProfile) {
      return NextResponse.json({ error: "Marka hesabı bulunamadı" }, { status: 404 });
    }

    const wallet = await prisma.wallet.findUnique({ where: { userId: session.user.id } });
    const activeCampaigns = await prisma.campaign.count({
      where: { brandId: user.brandProfile.id, status: "ACTIVE" },
    });

    return NextResponse.json({
      ok: true,
      profile: user.brandProfile,
      wallet,
      stats: {
        activeCampaigns,
        totalCampaigns: user.brandProfile.campaigns.length,
      },
      recentCampaigns: user.brandProfile.campaigns,
    });
  } catch (error) {
    return NextResponse.json({ error: "Panel verisi alınamadı", detail: String(error) }, { status: 500 });
  }
}
