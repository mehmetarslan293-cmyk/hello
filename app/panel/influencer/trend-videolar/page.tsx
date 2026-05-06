import { trendVideos } from "@/lib/influencer-panel/mock-data";

export default function TrendVideolarPage() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div className="flex flex-wrap gap-3">
        <button className="rounded-full border-2 border-[#0f1d3b] bg-[#0f1d3b] px-4 py-2 text-xs font-semibold text-white">Instagram � 1.849</button>
        <button className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-400">TikTok � 0</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {trendVideos.map((v) => (
          <article key={v.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-950">
              <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-bold text-white">{v.score}</span>
            </div>
            <div className="space-y-2 p-3.5">
              <p className="font-semibold text-gray-900">{v.handle}</p>
              <p className="text-xs text-gray-500">HOOK: {v.hook}</p>
              <div className="flex justify-between text-xs text-gray-600">
                <span>{v.views}</span>
                <span>{v.likes}</span>
                <span>{v.er}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
