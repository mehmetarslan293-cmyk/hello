import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { Role } from "@prisma/client";
import { getInfluencerProfileForUser, requireSession } from "@/lib/server/apiAuth";

export async function GET() {
  try {
    const { session, response } = await requireSession([Role.INFLUENCER]);
    if (!session?.user?.id || response) return response!;

    const profile = await getInfluencerProfileForUser(session.user.id);
    if (!profile) {
      return NextResponse.json({ error: "Influencer hesabı bulunamadı" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        influencerProfile: {
          include: {
            applications: {
              include: { campaign: true },
              orderBy: { appliedAt: "desc" },
              take: 8,
            },
          },
        },
      },
    });

    if (!user || user.role !== Role.INFLUENCER || !user.influencerProfile) {
      return NextResponse.json({ error: "Influencer hesabı bulunamadı" }, { status: 404 });
    }

    const wallet = await prisma.wallet.findUnique({ where: { userId: session.user.id } });

    return NextResponse.json({
      ok: true,
      profile: user.influencerProfile,
      wallet,
      applications: user.influencerProfile.applications,
      stats: {
        totalApplications: user.influencerProfile.applications.length,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Panel verisi alınamadı", detail: String(error) }, { status: 500 });
  }
}
