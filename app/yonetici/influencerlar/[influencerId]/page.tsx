import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, SectionTitle } from "@/app/components/admin/StatCard";
import { formatCompact, formatTry, influencers } from "@/lib/admin/mock-data";

type PageProps = {
  params: Promise<{ influencerId: string }>;
};

function getTierTone(tier: string) {
  if (tier === "altın") return "amber";
  if (tier === "gümüş") return "zinc";
  return "rose";
}

export default async function AdminInfluencerDetailPage({ params }: PageProps) {
  const { influencerId } = await params;
  const influencer = influencers.find((item) => item.id === influencerId);
  if (!influencer) notFound();

  return (
    <div className="space-y-8">
      <header>
        <p className="font-hero text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-400/90">Influencer profili</p>
        <h1 className="font-hero mt-2 text-3xl font-bold tracking-tight text-white md:text-[2rem]">{influencer.handle}</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">İçerik üreticinin özet performans metriklerini bu ekrandan kontrol edebilirsiniz.</p>
      </header>

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
        <SectionTitle title="Hesap özeti" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">E-posta</p>
            <p className="mt-2 text-sm font-semibold text-zinc-200">{influencer.email}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">Takipçi</p>
            <p className="mt-2 text-lg font-bold text-zinc-100">{formatCompact(influencer.followers)}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">30g kazanç</p>
            <p className="mt-2 text-lg font-bold text-emerald-300">{formatTry(influencer.earnings30dTry)}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">Seviye</p>
            <div className="mt-2">
              <Badge tone={getTierTone(influencer.tier)}>{influencer.tier}</Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
        <SectionTitle title="Hızlı kontrol" subtitle="Bu influencer için ilgili yönetim ekranlarına geçiş yapın." />
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/yonetici/influencerlar" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-white/30 hover:text-white">
            Influencer listesine dön
          </Link>
          <Link href="/yonetici/kampanyalar" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-white/30 hover:text-white">
            Kampanyaları incele
          </Link>
          <Link href="/yonetici/destek" className="rounded-full border border-indigo-400/40 px-4 py-2 text-sm font-semibold text-indigo-300 hover:border-indigo-300 hover:text-white">
            Destek taleplerini incele
          </Link>
        </div>
      </section>
    </div>
  );
}
