import Link from "next/link";
import { Badge, SectionTitle } from "@/app/components/admin/StatCard";
import { formatCompact, formatTry, influencers } from "@/lib/admin/mock-data";

export default function AdminInfluencerlarPage() {
  const tierTone = (t: string) => (t === "altın" ? "amber" : t === "gümüş" ? "zinc" : "rose");

  return (
    <div className="space-y-8">
      <header>
        <p className="font-hero text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-400/90">Influencerlar</p>
        <h1 className="font-hero mt-2 text-3xl font-bold tracking-tight text-white md:text-[2rem]">İçerik üreticileri</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Takipçi bandı, son 30 gün kazanç özeti ve doğrulama durumu.
        </p>
      </header>

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
        <SectionTitle title="Liste" />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wide text-zinc-500">
                <th className="pb-3 pr-4 font-semibold">Kanal</th>
                <th className="pb-3 pr-4 font-semibold">E-posta</th>
                <th className="pb-3 pr-4 font-semibold">Segment</th>
                <th className="pb-3 pr-4 font-semibold text-right">Takipçi</th>
                <th className="pb-3 pr-4 font-semibold text-right">30g kazanç</th>
                <th className="pb-3 pr-4 font-semibold text-center">Tamamlanan iş</th>
                <th className="pb-3 pr-4 font-semibold">Durum</th>
                <th className="pb-3 font-semibold">Kayıt</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {influencers.map((row) => (
                <tr key={row.id} className="border-b border-white/[0.04]">
                  <td className="py-3 pr-4 font-medium text-white">
                    <Link
                      href={`/yonetici/influencerlar/${row.id}`}
                      className="underline-offset-4 transition hover:text-indigo-300 hover:underline"
                    >
                      {row.handle}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-xs text-zinc-400">{row.email}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={tierTone(row.tier)}>{row.tier}</Badge>
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums">{formatCompact(row.followers)}</td>
                  <td className="py-3 pr-4 text-right tabular-nums text-emerald-300">{formatTry(row.earnings30dTry)}</td>
                  <td className="py-3 pr-4 text-center">{row.campaignsDone}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={row.status === "onaylı" ? "emerald" : row.status === "incelemede" ? "amber" : "rose"}>{row.status}</Badge>
                  </td>
                  <td className="py-3 whitespace-nowrap text-xs text-zinc-500">{row.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
