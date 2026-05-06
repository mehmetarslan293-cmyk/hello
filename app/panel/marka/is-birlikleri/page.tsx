import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/server/prisma";
import { CampaignStatus } from "@prisma/client";

function formatTry(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

function statusLabel(status: CampaignStatus) {
  if (status === CampaignStatus.ACTIVE) return "Aktif";
  if (status === CampaignStatus.PAUSED) return "Duraklatıldı";
  if (status === CampaignStatus.COMPLETED) return "Tamamlandı";
  if (status === CampaignStatus.CANCELLED) return "İptal";
  return "Taslak";
}

function flowStage(status: CampaignStatus) {
  if (status === CampaignStatus.DRAFT) return "Teklif gonderildi";
  if (status === CampaignStatus.ACTIVE) return "Escrow + icerik sureci";
  if (status === CampaignStatus.COMPLETED) return "Yayinlandi / odeme dagitildi";
  if (status === CampaignStatus.CANCELLED) return "Iptal edildi";
  return "Beklemede";
}

function readDetail(description: string | null | undefined, key: string) {
  if (!description) return "-";
  const line = description.split("\n").find((x) => x.startsWith(`${key}:`));
  return line ? line.slice(key.length + 1).trim() : "-";
}

function cargoStatusLabel(raw: string, status: CampaignStatus) {
  if (raw !== "-") return raw;
  if (status === CampaignStatus.COMPLETED) return "Teslim edildi";
  if (status === CampaignStatus.ACTIVE) return "Kargoda";
  return "Teslim edilmedi";
}

export default async function IsBirlikleriPage() {
  const session = await auth();
  const brand = session?.user?.id
    ? await prisma.brandProfile.findUnique({
        where: { userId: session.user.id },
        include: {
          campaigns: {
            orderBy: { createdAt: "desc" },
            include: { applications: true },
          },
        },
      })
    : null;

  const rows =
    brand?.campaigns.map((c) => ({
      id: c.id,
      name: c.title,
      targetInfluencer: readDetail(c.description, "INFLUENCER_HANDLE"),
      offerType: readDetail(c.description, "OFFER_TYPE"),
      productUrl: readDetail(c.description, "PRODUCT_URL"),
      productPrice: readDetail(c.description, "PRODUCT_PRICE"),
      cargoStatus: cargoStatusLabel(readDetail(c.description, "CARGO_STATUS"), c.status),
      status: statusLabel(c.status),
      stage: flowStage(c.status),
      budget: formatTry(c.budgetTotal),
      inf: c.applications.length,
    })) ?? [];
  const acceptedRows = rows.filter((r) => r.status === "Aktif");
  const pendingRows = rows.filter((r) => r.status !== "Aktif");

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-gray-600">Influencer secimi sonrasi olusan teklif ve yayin akislariniz.</p>
        <Link
          href="/panel/marka/araclar/influencer-kesfet"
          className="rounded-full bg-pink-600 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-pink-700"
        >
          + Influencer sec
        </Link>
      </div>

      <section className="space-y-3">
        <h2 className="font-hero text-lg font-bold text-gray-900">Aktif is birlikleri</h2>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Kampanya</th>
                <th className="px-4 py-3">Influencer</th>
                <th className="px-4 py-3">Teklif</th>
                <th className="px-4 py-3">Kargo</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3 text-right">Butce</th>
              </tr>
            </thead>
            <tbody>
              {acceptedRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                    Aktif is birligi yok. Influencer kesfet ile teklif olusturun.
                  </td>
                </tr>
              ) : (
                acceptedRows.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                    <td className="px-4 py-3 text-gray-600">{r.targetInfluencer}</td>
                    <td className="px-4 py-3 text-gray-600">{r.offerType}</td>
                    <td className="px-4 py-3 text-gray-600">{r.cargoStatus}</td>
                    <td className="px-4 py-3 text-gray-600">{r.stage}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-900">{r.budget}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-hero text-lg font-bold text-gray-900">Taslak / bekleyen</h2>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Kampanya</th>
                <th className="px-4 py-3">Hedef</th>
                <th className="px-4 py-3">Basvuru</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3 text-right">Butce</th>
              </tr>
            </thead>
            <tbody>
              {pendingRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                    Bekleyen taslak yok.
                  </td>
                </tr>
              ) : (
                pendingRows.map((r) => (
                  <tr key={`p-${r.id}`} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                    <td className="px-4 py-3 text-gray-600">{r.targetInfluencer}</td>
                    <td className="px-4 py-3 text-gray-600">{r.inf}</td>
                    <td className="px-4 py-3 text-gray-600">{r.status}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-900">{r.budget}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
