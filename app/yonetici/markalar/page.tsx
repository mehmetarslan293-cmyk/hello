import Link from "next/link";
import { Badge, SectionTitle } from "@/app/components/admin/StatCard";
import { brands, formatTry } from "@/lib/admin/mock-data";

export default function AdminMarkalarPage() {
  const totalBalance = brands.reduce((s, b) => s + b.balanceTry, 0);
  const totalEscrow = brands.reduce((s, b) => s + b.escrowTry, 0);

  return (
    <div className="space-y-8">
      <header>
        <p className="font-hero text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-400/90">Markalar</p>
        <h1 className="font-hero mt-2 text-3xl font-bold tracking-tight text-white md:text-[2rem]">Markalar & bakiye</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Kurumsal hesap bakiyeleri, escrow tutarları ve son 30 gün harcaması (demo).
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Toplam kullanılabilir</p>
          <p className="mt-2 font-hero text-2xl font-bold text-white">{formatTry(totalBalance)}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Escrow toplamı</p>
          <p className="mt-2 font-hero text-2xl font-bold text-amber-200">{formatTry(totalEscrow)}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Liste kayıt sayısı</p>
          <p className="mt-2 font-hero text-2xl font-bold text-white">{brands.length}</p>
        </div>
      </div>

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
        <SectionTitle title="Marka listesi" subtitle="Filtre ve export üretimde API ile bağlanır." />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wide text-zinc-500">
                <th className="pb-3 pr-4 font-semibold">Marka</th>
                <th className="pb-3 pr-4 font-semibold">İletişim</th>
                <th className="pb-3 pr-4 font-semibold text-right">Bakiye</th>
                <th className="pb-3 pr-4 font-semibold text-right">Escrow</th>
                <th className="pb-3 pr-4 font-semibold text-right">30g harcama</th>
                <th className="pb-3 pr-4 font-semibold text-center">Aktif kamp.</th>
                <th className="pb-3 pr-4 font-semibold">Durum</th>
                <th className="pb-3 font-semibold">Kayıt</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {brands.map((b) => (
                <tr key={b.id} className="border-b border-white/[0.04]">
                  <td className="py-3 pr-4 font-medium text-white">
                    <Link
                      href={`/yonetici/markalar/${b.id}`}
                      className="underline-offset-4 transition hover:text-indigo-300 hover:underline"
                    >
                      {b.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-xs text-zinc-400">{b.email}</td>
                  <td className="py-3 pr-4 text-right tabular-nums text-emerald-300">{formatTry(b.balanceTry)}</td>
                  <td className="py-3 pr-4 text-right tabular-nums">{formatTry(b.escrowTry)}</td>
                  <td className="py-3 pr-4 text-right tabular-nums">{formatTry(b.spent30dTry)}</td>
                  <td className="py-3 pr-4 text-center">{b.campaignsActive}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={b.status === "aktif" ? "emerald" : b.status === "beklemede" ? "amber" : "zinc"}>{b.status}</Badge>
                  </td>
                  <td className="py-3 whitespace-nowrap text-xs text-zinc-500">{b.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-center text-sm text-zinc-500">
        <Link href="/yonetici/finans" className="font-semibold text-indigo-300 hover:text-white">
          Finans & hareketler →
        </Link>
      </p>
    </div>
  );
}
