import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, SectionTitle } from "@/app/components/admin/StatCard";
import { brands, formatTry } from "@/lib/admin/mock-data";

type PageProps = {
  params: Promise<{ brandId: string }>;
};

export default async function AdminBrandDetailPage({ params }: PageProps) {
  const { brandId } = await params;
  const brand = brands.find((item) => item.id === brandId);
  if (!brand) notFound();

  return (
    <div className="space-y-8">
      <header>
        <p className="font-hero text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-400/90">Marka profili</p>
        <h1 className="font-hero mt-2 text-3xl font-bold tracking-tight text-white md:text-[2rem]">{brand.name}</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">Marka hesabı ve kampanya performans özetini bu ekrandan inceleyebilirsiniz.</p>
      </header>

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
        <SectionTitle title="Hesap özeti" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">E-posta</p>
            <p className="mt-2 text-sm font-semibold text-zinc-200">{brand.email}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">Kullanılabilir bakiye</p>
            <p className="mt-2 text-lg font-bold text-emerald-300">{formatTry(brand.balanceTry)}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">Escrow</p>
            <p className="mt-2 text-lg font-bold text-zinc-100">{formatTry(brand.escrowTry)}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">Durum</p>
            <div className="mt-2">
              <Badge tone={brand.status === "aktif" ? "emerald" : brand.status === "beklemede" ? "amber" : "zinc"}>{brand.status}</Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
        <SectionTitle title="Hızlı kontrol" subtitle="Bu marka için ilgili yönetim ekranlarına geçiş yapın." />
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/yonetici/markalar" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-white/30 hover:text-white">
            Marka listesine dön
          </Link>
          <Link href="/yonetici/finans" className="rounded-full border border-indigo-400/40 px-4 py-2 text-sm font-semibold text-indigo-300 hover:border-indigo-300 hover:text-white">
            Finans hareketlerini incele
          </Link>
          <Link href="/yonetici/kampanyalar" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-white/30 hover:text-white">
            Kampanyaları incele
          </Link>
        </div>
      </section>
    </div>
  );
}
