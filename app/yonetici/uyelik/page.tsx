import { SectionTitle, StatCard } from "@/app/components/admin/StatCard";
import { kpis, signupsWeekly } from "@/lib/admin/mock-data";

export default function AdminUyelikPage() {
  const brandSum = signupsWeekly.reduce((s, w) => s + w.brands, 0);
  const infSum = signupsWeekly.reduce((s, w) => s + w.influencers, 0);

  return (
    <div className="space-y-8">
      <header>
        <p className="font-hero text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-400/90">Üyelik</p>
        <h1 className="font-hero mt-2 text-3xl font-bold tracking-tight text-white md:text-[2rem]">Üyelik istatistikleri</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Büyüme funnel&apos;i için özet sayılar; grafik verisi demo haftalık örnekle beslenir.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Marka (toplam)" value={String(kpis.brandsTotal)} />
        <StatCard title="Influencer (toplam)" value={String(kpis.influencersTotal)} variant="emerald" />
        <StatCard title="Yeni (7 gün)" value={String(kpis.newUsers7d)} hint="Tüm roller" variant="amber" />
        <StatCard title="Yeni (30 gün)" value={String(kpis.newUsers30d)} hint="Tüm roller" variant="rose" />
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
          <SectionTitle title="Doğrulama oranı (influencer)" subtitle="Platform güven skoru için önemli gösterge." />
          <p className="mt-4 font-hero text-4xl font-bold text-white">
            {Math.round((kpis.influencersVerified / kpis.influencersTotal) * 100)}%
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            {kpis.influencersVerified} / {kpis.influencersTotal} doğrulanmış profil (demo).
          </p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
          <SectionTitle title="Son 4 hafta (demo toplam)" subtitle="Haftalık kümülatif kayıt tabanında yer alan segmentler." />
          <dl className="mt-6 space-y-4">
            <div className="flex justify-between border-b border-white/[0.06] pb-3">
              <dt className="text-zinc-400">Marka (H1–H4)</dt>
              <dd className="font-hero font-bold text-white">{brandSum}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-400">Influencer (H1–H4)</dt>
              <dd className="font-hero font-bold text-white">{infSum}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6">
        <p className="text-sm text-zinc-400">
          Üretimde buraya <strong className="text-zinc-300">kohort analizi</strong>, kaynak kanalı (organic / paid), iptal oranı ve
          yaşam boyu değer (LTV) panelleri bağlanabilir.
        </p>
      </section>
    </div>
  );
}
