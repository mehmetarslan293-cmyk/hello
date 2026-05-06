import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { getBrandProfileForUser, requireSession } from "@/lib/server/apiAuth";

export async function GET() {
  try {
    const { session, response } = await requireSession([Role.BRAND]);
    if (!session?.user?.id || response) return response!;

    const brand = await getBrandProfileForUser(session.user.id);
    if (!brand) {
      return NextResponse.json({ ok: true, deliverables: [] });
    }

    const deliverables = await prisma.deliverable.findMany({
      where: {
        campaign: {
          brandId: brand.id,
        },
      },
      include: {
        campaign: {
          select: { id: true, title: true },
        },
        influencer: {
          select: { id: true, handle: true, city: true },
        },
        ratingLogs: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: { id: true, rating: true, note: true, createdAt: true, actorUserId: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, deliverables });
  } catch (error) {
    return NextResponse.json(
      { error: "Icerik teslimleri alinamadi", detail: String(error) },
      { status: 500 },
    );
  }
}
