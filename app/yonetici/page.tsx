import Link from "next/link";
import { Badge, SectionTitle, StatCard } from "@/app/components/admin/StatCard";
import {
  auditLog,
  campaigns,
  formatCompact,
  formatTry,
  kpis,
  ledger,
  signupsWeekly,
  tickets,
} from "@/lib/admin/mock-data";

export default function YoneticiDashboardPage() {
  const maxInf = Math.max(...signupsWeekly.map((w) => w.influencers), 1);

  return (
    <div className="space-y-12">
      <header>
        <p className="font-hero text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-400/90">Özet</p>
        <h1 className="font-hero mt-2 text-3xl font-bold tracking-tight text-white md:text-[2rem]">Genel bakış</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Marka ve influencer üye sayıları, GMV, havuz bakiyeleri ve açık destek talepleri tek ekranda.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Kayıtlı marka" value={String(kpis.brandsTotal)} hint="Panel erişimi olan kurumsal hesaplar" />
        <StatCard title="Influencer" value={String(kpis.influencersTotal)} hint={`Doğrulanmış: ${kpis.influencersVerified}`} variant="emerald" />
        <StatCard title="Aktif kampanya" value={String(kpis.campaignsActive)} hint={`Tüm zamanlar: ${kpis.campaignsTotalAllTime}`} variant="amber" />
        <StatCard title="GMV (30 gün)" value={formatTry(kpis.gmv30dTry)} hint={`Platform ücreti: ${formatTry(kpis.platformFee30dTry)}`} variant="rose" />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <StatCard title="Toplam escrow" value={formatTry(kpis.escrowTotalTry)} hint="Kampanya güvencesi havuzu" />
        <StatCard title="Ödeme bekleyen" value={formatTry(kpis.payoutsPendingTry)} hint="Influencer çıkış kuyruğu" />
        <StatCard title="Açık destek" value={String(kpis.ticketsOpen)} hint={`Ort. ilk yanıt: ${kpis.avgResponseHours} saat`} />
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
          <SectionTitle title="Haftalık yeni üyeler" subtitle="Son 4 hafta — marka vs influencer kayıtları (demo)." />
          <div className="flex h-48 items-end gap-3 border-b border-white/[0.06] pb-2 pt-4">
            {signupsWeekly.map((w) => (
              <div key={w.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-40 w-full items-end justify-center gap-1">
                  <div
                    className="w-[42%] rounded-t-md bg-indigo-500/70"
                    style={{ height: `${Math.max(8, (w.brands / 25) * 100)}%` }}
                    title={`Marka: ${w.brands}`}
                  />
                  <div
                    className="w-[42%] rounded-t-md bg-violet-500/70"
                    style={{ height: `${Math.max(8, (w.influencers / maxInf) * 100)}%` }}
                    title={`Influencer: ${w.influencers}`}
                  />
                </div>
                <span className="text-[11px] font-medium text-zinc-500">{w.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-6 text-[11px] text-zinc-500">
            <span className="flex items-center gap-2">
              <span className="h-2 w-4 rounded bg-indigo-500/70" /> Marka
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-4 rounded bg-violet-500/70" /> Influencer
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
          <SectionTitle title="Büyüme" subtitle="Son 7 ve 30 günde platforma katılan kullanıcılar." />
          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <dt className="text-sm text-zinc-400">Yeni üye (7 gün)</dt>
              <dd className="font-hero text-xl font-bold text-white">{kpis.newUsers7d}</dd>
            </div>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <dt className="text-sm text-zinc-400">Yeni üye (30 gün)</dt>
              <dd className="font-hero text-xl font-bold text-white">{kpis.newUsers30d}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-zinc-400">Net gelir payı (30 gün)</dt>
              <dd className="font-hero text-lg font-bold text-emerald-300">{formatTry(kpis.platformFee30dTry)}</dd>
            </div>
          </dl>
          <Link
            href="/yonetici/uyelik"
            className="mt-6 inline-flex text-sm font-semibold text-indigo-300 hover:text-white"
          >
            Üyelik raporuna git →
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
        <SectionTitle title="Son finansal hareketler" subtitle="Ledger özeti — detay için Finans sayfasına gidin." />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wide text-zinc-500">
                <th className="pb-3 pr-4 font-semibold">Zaman</th>
                <th className="pb-3 pr-4 font-semibold">Tür</th>
                <th className="pb-3 pr-4 font-semibold">Taraf</th>
                <th className="pb-3 pr-4 font-semibold text-right">Tutar</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {ledger.slice(0, 4).map((row) => (
                <tr key={row.id} className="border-b border-white/[0.04]">
                  <td className="py-3 pr-4 whitespace-nowrap text-zinc-500">{row.at}</td>
                  <td className="py-3 pr-4">{row.type.replace("_", " ")}</td>
                  <td className="py-3 pr-4">{row.party}</td>
                  <td className={`py-3 text-right font-medium tabular-nums ${row.amountTry >= 0 ? "text-emerald-400" : "text-rose-300"}`}>
                    {row.amountTry >= 0 ? "+" : ""}
                    {formatTry(row.amountTry)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link href="/yonetici/finans" className="mt-4 inline-flex text-sm font-semibold text-indigo-300 hover:text-white">
          Tüm hareketler →
        </Link>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
          <SectionTitle title="Öncelikli destek" />
          <ul className="mt-4 space-y-3">
            {tickets.slice(0, 3).map((t) => (
              <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-black/20 px-4 py-3">
                <div>
                  <p className="font-medium text-white">{t.subject}</p>
                  <p className="text-xs text-zinc-500">
                    {t.from} · {t.role}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={t.priority === "yuksek" ? "rose" : t.priority === "normal" ? "amber" : "zinc"}>{t.priority}</Badge>
                  <Badge tone={t.status === "acik" ? "amber" : t.status === "islemde" ? "indigo" : "emerald"}>{t.status}</Badge>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/yonetici/destek" className="mt-4 inline-flex text-sm font-semibold text-indigo-300 hover:text-white">
            Tüm talepler →
          </Link>
        </section>

        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
          <SectionTitle title="Son sistem olayları" />
          <ul className="mt-4 space-y-3">
            {auditLog.map((a) => (
              <li key={a.id} className="rounded-xl border border-white/[0.06] bg-black/20 px-4 py-3 text-sm">
                <p className="text-xs text-zinc-500">{a.at}</p>
                <p className="mt-1 text-white">
                  <span className="text-indigo-300">{a.actor}</span> · {a.action}
                </p>
                <p className="mt-1 text-zinc-400">{a.detail}</p>
              </li>
            ))}
          </ul>
          <Link href="/yonetici/sistem" className="mt-4 inline-flex text-sm font-semibold text-indigo-300 hover:text-white">
            Günlüğün tamamı →
          </Link>
        </section>
      </div>

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
        <SectionTitle title="Kampanya özeti" subtitle="Aktif ve yakın zamanda tamamlanan işbirlikleri." />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wide text-zinc-500">
                <th className="pb-3 pr-4 font-semibold">Kampanya</th>
                <th className="pb-3 pr-4 font-semibold">Marka</th>
                <th className="pb-3 pr-4 font-semibold">Bütçe</th>
                <th className="pb-3 pr-4 font-semibold">Durum</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-white/[0.04]">
                  <td className="py-3 pr-4 font-medium text-white">{c.title}</td>
                  <td className="py-3 pr-4">{c.brand}</td>
                  <td className="py-3 pr-4 tabular-nums">{formatTry(c.budgetTry)}</td>
                  <td className="py-3">
                    <Badge tone={c.status === "aktif" ? "emerald" : c.status === "tamamlandi" ? "zinc" : "amber"}>{c.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link href="/yonetici/kampanyalar" className="mt-4 inline-flex text-sm font-semibold text-indigo-300 hover:text-white">
          Kampanya listesi →
        </Link>
      </section>

      <section className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center">
        <p className="text-sm text-zinc-400">
          Hızlı erişim: marka bakiyeleri{" "}
          <Link className="font-semibold text-white underline-offset-4 hover:underline" href="/yonetici/markalar">
            bakiye tablosu
          </Link>
          , influencer performansı{" "}
          <Link className="font-semibold text-white underline-offset-4 hover:underline" href="/yonetici/influencerlar">
            influencerlar
          </Link>
          , toplam içerik hacmi yaklaşık{" "}
          <span className="tabular-nums text-white">{formatCompact(kpis.gmv30dTry)} ₺</span> (30 gün).
        </p>
      </section>
    </div>
  );
}
