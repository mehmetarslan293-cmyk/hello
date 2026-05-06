import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { requireSession } from "@/lib/server/apiAuth";
import { prisma } from "@/lib/server/prisma";
import { syncInfluencerMetrics } from "@/lib/server/social/syncInfluencerMetrics";

export async function POST() {
  const { session, response } = await requireSession([Role.INFLUENCER]);
  if (!session?.user?.id || response) return response!;

  const influencer = await prisma.influencerProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!influencer) return NextResponse.json({ error: "Influencer profili bulunamadi" }, { status: 404 });

  try {
    const result = await syncInfluencerMetrics(influencer.id);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json({ error: "Senkron başarısız", detail: String(error) }, { status: 500 });
  }
}
