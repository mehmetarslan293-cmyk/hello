import { SectionTitle } from "@/app/components/admin/StatCard";
import { auditLog } from "@/lib/admin/mock-data";

export default function AdminSistemPage() {
  const jobs = [
    { name: "payout-worker", status: "çalışıyor", lag: "12 sn" },
    { name: "webhook-delivery", status: "çalışıyor", lag: "340 ms" },
    { name: "risk-score-batch", status: "beklemede", lag: "—" },
  ];

  return (
    <div className="space-y-8">
      <header>
        <p className="font-hero text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-400/90">Sistem</p>
        <h1 className="font-hero mt-2 text-3xl font-bold tracking-tight text-white md:text-[2rem]">Sistem günlüğü</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Denetim kayıtları ve arka plan işleri (demo durumu).
        </p>
      </header>

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
        <SectionTitle title="Arka plan işleri" subtitle="Üretimde gerçek zamanlı health endpoint ile beslenir." />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wide text-zinc-500">
                <th className="pb-3 pr-4 font-semibold">İş</th>
                <th className="pb-3 pr-4 font-semibold">Durum</th>
                <th className="pb-3 font-semibold">Gecikme</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {jobs.map((j) => (
                <tr key={j.name} className="border-b border-white/[0.04]">
                  <td className="py-3 pr-4 font-mono text-xs text-white">{j.name}</td>
                  <td className="py-3 pr-4">{j.status}</td>
                  <td className="py-3 text-zinc-500">{j.lag}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
        <SectionTitle title="Denetim günlüğü (audit)" />
        <ul className="mt-6 space-y-4">
          {auditLog.map((a) => (
            <li key={a.id} className="rounded-xl border border-white/[0.06] bg-black/25 px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-zinc-500">{a.at}</span>
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">{a.actor}</span>
              </div>
              <p className="mt-2 font-mono text-sm text-indigo-300">{a.action}</p>
              <p className="mt-1 text-sm text-zinc-400">{a.detail}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
