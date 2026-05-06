import { NextResponse } from "next/server";
import { DeliverableStatus, Platform, Role } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { requireSession } from "@/lib/server/apiAuth";
import { followerTrendDelta } from "@/lib/server/social/trendFromSnapshots";

function parseLegacyRating(reviewNote: string | null | undefined): number | null {
  if (!reviewNote) return null;
  const match = reviewNote.match(/RATING:(\d)/);
  if (!match) return null;
  const n = Number(match[1]);
  if (!Number.isFinite(n) || n < 1 || n > 5) return null;
  return n;
}

function effectiveRating(brandRating: number | null | undefined, reviewNote: string | null) {
  if (brandRating != null && brandRating >= 1 && brandRating <= 5) return brandRating;
  return parseLegacyRating(reviewNote);
}

function normalizeHandle(handle: string | null | undefined) {
  if (!handle) return "";
  return handle.trim().toLowerCase().replace(/^@/, "");
}

export async function GET() {
  try {
    const { response } = await requireSession([Role.INFLUENCER]);
    if (response) return response;

    const [influencers, trendVideos, snapshots] = await Promise.all([
      prisma.influencerProfile.findMany({
        include: {
          platformAccounts: true,
          deliverables: {
            where: { status: DeliverableStatus.APPROVED },
            select: { id: true, reviewNote: true, brandRating: true },
          },
        },
      }),
      prisma.trendVideo.findMany({
        select: { handle: true, views: true },
      }),
      prisma.influencerMetricSnapshot.findMany({
        orderBy: { capturedAt: "asc" },
      }),
    ]);

    const snapsByInf = new Map<string, typeof snapshots>();
    for (const s of snapshots) {
      const list = snapsByInf.get(s.influencerId) ?? [];
      list.push(s);
      snapsByInf.set(s.influencerId, list);
    }

    const ranking = influencers
      .map((inf) => {
        const igFollowers =
          inf.platformAccounts.filter((a) => a.platform === Platform.INSTAGRAM).reduce((max, a) => Math.max(max, a.followersSnapshot), 0) ||
          0;
        const ttFollowers =
          inf.platformAccounts.filter((a) => a.platform === Platform.TIKTOK).reduce((max, a) => Math.max(max, a.followersSnapshot), 0) || 0;
        const followersTotal = Math.max(inf.followers, igFollowers + ttFollowers);

        const normalized = normalizeHandle(inf.handle);
        const relatedTrends = trendVideos.filter((t) => normalizeHandle(t.handle) === normalized);
        const avgViewsRaw =
          relatedTrends.length > 0
            ? Math.round(relatedTrends.reduce((sum, t) => sum + t.views, 0) / relatedTrends.length)
            : 0;

        const ratings = inf.deliverables
          .map((d) => effectiveRating(d.brandRating, d.reviewNote))
          .filter((n): n is number => n !== null);
        const avgRating = ratings.length ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)) : 0;
        const successfulCampaigns = inf.deliverables.length;

        const trendDelta = followerTrendDelta(snapsByInf.get(inf.id) ?? []);

        return {
          id: inf.id,
          handle: inf.handle ?? "influencer",
          category: inf.category ?? "-",
          instagramFollowers: igFollowers,
          tiktokFollowers: ttFollowers,
          followersTotal,
          averageViews: avgViewsRaw,
          engagementRate: inf.engagementRate,
          avgBrandRating: avgRating,
          successfulCampaigns,
          rankingScore: Number((avgRating * 20 + Math.max(-5, Math.min(5, trendDelta / 1000))).toFixed(2)),
          trendFollowersDelta: trendDelta,
        };
      })
      .sort((a, b) => {
        if (b.avgBrandRating !== a.avgBrandRating) return b.avgBrandRating - a.avgBrandRating;
        if (b.trendFollowersDelta !== a.trendFollowersDelta) return b.trendFollowersDelta - a.trendFollowersDelta;
        if (b.successfulCampaigns !== a.successfulCampaigns) return b.successfulCampaigns - a.successfulCampaigns;
        return b.followersTotal - a.followersTotal;
      })
      .map((row, index) => ({ ...row, rank: index + 1 }));

    return NextResponse.json({ ok: true, ranking });
  } catch (error) {
    return NextResponse.json({ error: "Sıralama verisi alinamadi", detail: String(error) }, { status: 500 });
  }
}
