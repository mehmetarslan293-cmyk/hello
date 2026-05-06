import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { syncAllInfluencerMetrics } from "@/lib/server/social/syncInfluencerMetrics";

export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  const header = req.headers.get("x-cron-secret");
  if (secret && header !== secret) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  if (!secret && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "CRON_SECRET tanimlanmali" }, { status: 500 });
  }

  const lockKey = "social-metrics-sync";
  const now = new Date();
  const lockUntil = new Date(now.getTime() + 5 * 60 * 1000);
  let acquired = false;

  try {
    try {
      await prisma.jobLock.create({
        data: { key: lockKey, expiresAt: lockUntil },
      });
      acquired = true;
    } catch {
      const takeover = await prisma.jobLock.updateMany({
        where: { key: lockKey, expiresAt: { lt: now } },
        data: { expiresAt: lockUntil },
      });
      acquired = takeover.count > 0;
    }
    if (!acquired) {
      return NextResponse.json({ error: "Sync zaten calisiyor" }, { status: 409 });
    }

    const result = await syncAllInfluencerMetrics();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json({ error: "Senkron başarısız", detail: String(error) }, { status: 500 });
  } finally {
    if (acquired) {
      await prisma.jobLock.updateMany({
        where: { key: lockKey },
        data: { expiresAt: new Date() },
      });
    }
  }
}
