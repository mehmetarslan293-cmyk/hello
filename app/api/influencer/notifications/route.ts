import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { requireSession } from "@/lib/server/apiAuth";

export async function GET() {
  try {
    const { session, response } = await requireSession([Role.INFLUENCER]);
    if (!session?.user?.id || response) return response!;

    const [unreadCount, notifications] = await Promise.all([
      prisma.notification.count({
        where: {
          userId: session.user.id,
          isRead: false,
        },
      }),
      prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          title: true,
          body: true,
          link: true,
          isRead: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({ ok: true, unreadCount, notifications });
  } catch (error) {
    return NextResponse.json({ error: "Bildirimler alinamadi", detail: String(error) }, { status: 500 });
  }
}
