import { Badge, SectionTitle } from "@/app/components/admin/StatCard";
import { tickets } from "@/lib/admin/mock-data";

export default function AdminDestekPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="font-hero text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-400/90">Destek</p>
        <h1 className="font-hero mt-2 text-3xl font-bold tracking-tight text-white md:text-[2rem]">Destek talepleri</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Öncelik ve durum etiketleri — ticketing sistemi entegrasyonuna hazır tablo.
        </p>
      </header>

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
        <SectionTitle title="Kuyruk" />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wide text-zinc-500">
                <th className="pb-3 pr-4 font-semibold">Konu</th>
                <th className="pb-3 pr-4 font-semibold">Kimden</th>
                <th className="pb-3 pr-4 font-semibold">Rol</th>
                <th className="pb-3 pr-4 font-semibold">Öncelik</th>
                <th className="pb-3 pr-4 font-semibold">Durum</th>
                <th className="pb-3 font-semibold">Güncelleme</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {tickets.map((t) => (
                <tr key={t.id} className="border-b border-white/[0.04]">
                  <td className="py-3 pr-4 font-medium text-white">{t.subject}</td>
                  <td className="py-3 pr-4">{t.from}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={t.role === "marka" ? "indigo" : "violet"}>{t.role}</Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge tone={t.priority === "yuksek" ? "rose" : t.priority === "normal" ? "amber" : "zinc"}>{t.priority}</Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge tone={t.status === "acik" ? "amber" : t.status === "islemde" ? "indigo" : "emerald"}>{t.status}</Badge>
                  </td>
                  <td className="py-3 whitespace-nowrap text-xs text-zinc-500">{t.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
