import type { InfluencerMetricSnapshot, Platform } from "@prisma/client";

type Snap = Pick<InfluencerMetricSnapshot, "capturedAt" | "followers" | "avgViews" | "platform">;

function latestPerPlatform(rows: Snap[]): Map<Platform, Snap> {
  const map = new Map<Platform, Snap>();
  for (const r of rows) {
    const cur = map.get(r.platform);
    if (!cur || r.capturedAt > cur.capturedAt) map.set(r.platform, r);
  }
  return map;
}

function sumFollowers(map: Map<Platform, Snap>) {
  let t = 0;
  for (const v of map.values()) t += v.followers;
  return t;
}

function totalsForWindow(snaps: Snap[], start: number, end: number) {
  const win = snaps.filter((s) => {
    const t = s.capturedAt.getTime();
    return t >= start && t <= end;
  });
  if (!win.length) return null;
  return sumFollowers(latestPerPlatform(win));
}

/** Son 7 gün ile önceki 7 gün arasındaki toplam takipçi farkı (penceredeki platform bazlı en güncel snapshot). */
export function followerTrendDelta(snaps: Snap[]): number {
  if (!snaps.length) return 0;
  const now = Date.now();
  const d7 = 7 * 86_400_000;
  const recent = totalsForWindow(snaps, now - d7, now);
  const prev = totalsForWindow(snaps, now - 2 * d7, now - d7);
  if (recent == null) return 0;
  if (prev == null) return 0;
  return recent - prev;
}
