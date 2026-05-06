import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/server/prisma";
import { ApplicationStatus, CampaignStatus, DeliverableStatus } from "@prisma/client";

const quick = [
  { href: "/panel/marka/araclar/influencer-kesfet", title: "Influencer keşfet", desc: "Uygun profili seç ve teklif gönder", color: "from-violet-500 to-purple-600" },
  { href: "/panel/marka/is-birlikleri", title: "Teklif & iş akışı", desc: "Ödeme, escrow ve yayın adımlarını yönet", color: "from-pink-500 to-rose-500" },
  { href: "/panel/marka/influencerlarim", title: "Influencer içerikleri", desc: "Teslim içerikleri onayla veya revize iste", color: "from-blue-500 to-cyan-500" },
  { href: "/panel/marka/performans", title: "Performans", desc: "ROI ve harcama özeti", color: "from-emerald-500 to-teal-600" },
];

function formatTryCompact(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
    notation: value >= 10_000 ? "compact" : "standard",
  }).format(value);
}

export default async function MarkaPanelHomePage() {
  const session = await auth();
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30);

  const brand = session?.user?.id
    ? await prisma.brandProfile.findUnique({
        where: { userId: session.user.id },
        include: {
          campaigns: {
            include: {
              applications: true,
              deliverables: true,
            },
          },
        },
      })
    : null;

  const activeCampaign = brand
    ? brand.campaigns.filter((c) => c.status === CampaignStatus.ACTIVE).length
    : 0;
  const draftCampaign = brand
    ? brand.campaigns.filter((c) => c.status === CampaignStatus.DRAFT).length
    : 0;
  const spend30d = brand
    ? brand.campaigns
        .filter((c) => c.createdAt >= thirtyDaysAgo)
        .reduce((sum, c) => sum + c.budgetSpent, 0)
    : 0;
  const matchedInfluencer = brand
    ? brand.campaigns
        .flatMap((c) => c.applications)
        .filter((a) => a.status === ApplicationStatus.ACCEPTED).length
    : 0;
  const pendingApproval = brand
    ? brand.campaigns
        .flatMap((c) => c.deliverables)
        .filter((d) => d.status === DeliverableStatus.SUBMITTED || d.status === DeliverableStatus.REVISION_REQUESTED).length
    : 0;
  const newMember = brand
    ? brand.campaigns
        .flatMap((c) => c.applications)
        .filter((a) => a.appliedAt >= thirtyDaysAgo).length
    : 0;

  const cards = [
    { label: "Aktif kampanya", value: String(activeCampaign), sub: `Taslak: ${draftCampaign}` },
    { label: "Toplam harcama (30g)", value: formatTryCompact(spend30d), sub: "Son 30 gün toplamı" },
    { label: "Eşleşen influencer", value: String(matchedInfluencer), sub: "Kabul edilen başvurular" },
    { label: "Bekleyen onay", value: String(pendingApproval), sub: "İçerik + mesaj" },
    { label: "Yeni üye", value: String(newMember), sub: "30 günde yeni başvuru" },
  ];

  return (
    <div className="mx-auto max-w-[1200px] space-y-10">
      <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-medium text-pink-600">Hoş geldiniz</p>
        <h2 className="mt-2 font-hero text-2xl font-bold text-gray-900 md:text-3xl">Bugün ne yapmak istersiniz?</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
          Influencer secin, ucretli veya barter teklif gecin, icerik onaylarini yonetin ve yayin sonrasi odemeleri guvenli sekilde tamamlayin.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((k) => (
          <div key={k.label} className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{k.label}</p>
            <p className="mt-2 font-hero text-2xl font-bold text-gray-900">{k.value}</p>
            <p className="mt-1 text-xs text-gray-500">{k.sub}</p>
          </div>
        ))}
      </section>

      <section>
        <h3 className="mb-4 font-hero text-lg font-bold text-gray-900">Hızlı erişim</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {quick.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className={`group flex flex-col rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition hover:shadow-md`}
            >
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${q.color} text-lg text-white shadow-inner`}>
                →
              </span>
              <span className="mt-4 font-hero text-lg font-bold text-gray-900 group-hover:text-pink-600">{q.title}</span>
              <span className="mt-1 text-sm text-gray-600">{q.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-gray-300 bg-white/60 p-6 text-sm text-gray-600">
        <strong className="text-gray-900">Önerilen akış:</strong> Influencer keşfet ile profil seçin → ücretli teklif veya barter oluşturun → influencer onayladığında brief paylaşın → tutar escrowda beklesin → içerik onayı verin → paylaşım sonrası final onayı ile komisyon düşülüp kalan tutar influencer cüzdanına aktarılsın.
      </section>
    </div>
  );
}
