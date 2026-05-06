"use client";

import { useEffect, useMemo, useState } from "react";

type RankingRow = {
  id: string;
  rank: number;
  handle: string;
  category: string;
  instagramFollowers: number;
  tiktokFollowers: number;
  followersTotal: number;
  averageViews: number;
  engagementRate: number;
  avgBrandRating: number;
  successfulCampaigns: number;
  rankingScore: number;
  trendFollowersDelta: number;
};

function fmtCompact(n: number) {
  return new Intl.NumberFormat("tr-TR", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

function renderStars(value: number) {
  const rounded = Math.round(value);
  return `${"★".repeat(Math.max(0, rounded))}${"☆".repeat(Math.max(0, 5 - rounded))}`;
}

export default function TopInfluencerlarPage() {
  const [rows, setRows] = useState<RankingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/influencer/rankings", { credentials: "include", cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Sıralama verisi alinamadi");
        setRows(data.ranking ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sıralama verisi alinamadi");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const topThree = useMemo(() => rows.slice(0, 3), [rows]);

  return (
    <div className="mx-auto max-w-[980px] space-y-6">
      <p className="text-sm text-gray-600">
        Instagram/TikTok verileri senkron sonrasi guncellenir. Hesap baglantilarinizi ve health durumlarini yeni &quot;Sosyal hesaplar&quot; menusu altindan yonetebilirsiniz.
      </p>
      {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <div className="grid gap-3 sm:grid-cols-3">
        {topThree.map((r) => (
          <div key={`${r.id}-card`} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">#{r.rank} Siradaki</p>
            <p className="mt-2 font-hero text-lg font-bold text-gray-900">{r.handle}</p>
            <p className="text-xs text-gray-500">{r.category}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
              <span>ER %{r.engagementRate.toFixed(1)}</span>
              <span>Izlenme {fmtCompact(r.averageViews)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="rounded-full bg-pink-100 px-2.5 py-1 text-xs font-bold text-pink-700">Skor {r.rankingScore}</span>
              <span className="text-xs font-semibold text-amber-600">{renderStars(r.avgBrandRating)}</span>
            </div>
            <p className="mt-2 text-[11px] text-gray-500">
              Trend (7g):{" "}
              <span className={r.trendFollowersDelta >= 0 ? "font-semibold text-emerald-600" : "font-semibold text-rose-600"}>
                {r.trendFollowersDelta >= 0 ? "+" : ""}
                {fmtCompact(r.trendFollowersDelta)} takipci
              </span>
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Sira</th>
              <th className="px-4 py-3">Influencer</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3 text-right">Instagram</th>
              <th className="px-4 py-3 text-right">TikTok</th>
              <th className="px-4 py-3 text-right">ER</th>
              <th className="px-4 py-3 text-right">Ort. Izlenme</th>
              <th className="px-4 py-3 text-right">Yıldız</th>
              <th className="px-4 py-3 text-right">Basarili Kampanya</th>
              <th className="px-4 py-3 text-right">Skor</th>
              <th className="px-4 py-3 text-right">Trend (7g)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={11}>Sıralama verileri yukleniyor...</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={11}>Henuz sıralama verisi bulunmuyor.</td>
              </tr>
            ) : (
              rows.map((r) => (
              <tr key={r.id} className="border-b border-gray-50 last:border-0">
                <td className="px-4 py-3.5 font-semibold text-gray-900">#{r.rank}</td>
                <td className="px-4 py-3.5">
                  <p className="font-semibold text-gray-900">{r.handle}</p>
                </td>
                <td className="px-4 py-3.5 text-gray-600">{r.category}</td>
                <td className="px-4 py-3.5 text-right tabular-nums text-gray-700">{fmtCompact(r.instagramFollowers)}</td>
                <td className="px-4 py-3.5 text-right tabular-nums text-gray-700">{fmtCompact(r.tiktokFollowers)}</td>
                <td className="px-4 py-3.5 text-right tabular-nums text-gray-700">%{r.engagementRate.toFixed(1)}</td>
                <td className="px-4 py-3.5 text-right tabular-nums text-gray-700">{fmtCompact(r.averageViews)}</td>
                <td className="px-4 py-3.5 text-right text-xs font-semibold text-amber-600">{renderStars(r.avgBrandRating)}</td>
                <td className="px-4 py-3.5 text-right tabular-nums text-gray-700">{r.successfulCampaigns}</td>
                <td className="px-4 py-3.5 text-right">
                  <span className="rounded-full bg-pink-100 px-2.5 py-1 text-xs font-bold text-pink-700">{r.rankingScore}</span>
                </td>
                <td className={`px-4 py-3.5 text-right text-xs font-semibold tabular-nums ${r.trendFollowersDelta >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {r.trendFollowersDelta >= 0 ? "+" : ""}
                  {fmtCompact(r.trendFollowersDelta)}
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
