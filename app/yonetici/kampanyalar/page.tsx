import { Badge, SectionTitle } from "@/app/components/admin/StatCard";
import { campaigns, formatTry } from "@/lib/admin/mock-data";

export default function AdminKampanyalarPage() {
  const active = campaigns.filter((c) => c.status === "aktif").length;

  return (
    <div className="space-y-8">
      <header>
        <p className="font-hero text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-400/90">Kampanyalar</p>
        <h1 className="font-hero mt-2 text-3xl font-bold tracking-tight text-white md:text-[2rem]">İşbirlikleri</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Bütçe kullanımı, atanmış influencer sayısı ve kampanya durumu.
        </p>
      </header>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-6 py-4">
        <p className="text-sm text-zinc-400">
          Şu an <span className="font-hero font-bold text-white">{active}</span> kampanya yayında (demo tablo).
        </p>
      </div>

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
        <SectionTitle title="Tüm kampanyalar" />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wide text-zinc-500">
                <th className="pb-3 pr-4 font-semibold">Başlık</th>
                <th className="pb-3 pr-4 font-semibold">Marka</th>
                <th className="pb-3 pr-4 font-semibold text-right">Bütçe</th>
                <th className="pb-3 pr-4 font-semibold text-right">Harcanan</th>
                <th className="pb-3 pr-4 font-semibold text-center">Inf.</th>
                <th className="pb-3 pr-4 font-semibold">Durum</th>
                <th className="pb-3 font-semibold">Son tarih</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-white/[0.04]">
                  <td className="py-3 pr-4 font-medium text-white">{c.title}</td>
                  <td className="py-3 pr-4">{c.brand}</td>
                  <td className="py-3 pr-4 text-right tabular-nums">{formatTry(c.budgetTry)}</td>
                  <td className="py-3 pr-4 text-right tabular-nums">{formatTry(c.spentTry)}</td>
                  <td className="py-3 pr-4 text-center">{c.influencers}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={c.status === "aktif" ? "emerald" : c.status === "tamamlandi" ? "zinc" : "amber"}>{c.status}</Badge>
                  </td>
                  <td className="py-3 whitespace-nowrap text-xs text-zinc-500">{c.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
