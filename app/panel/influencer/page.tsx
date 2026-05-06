import { auth } from "@/auth";
import { ApplicationStatus, DeliverableStatus, FinancialTxnType } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";

export default async function InfluencerDashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [influencer, wallet, applications, deliverables, recentTransactions] = userId
    ? await Promise.all([
        prisma.influencerProfile.findUnique({
          where: { userId },
          select: { id: true, handle: true, engagementRate: true, followers: true, category: true },
        }),
        prisma.wallet.findUnique({
          where: { userId },
          select: { id: true, balance: true, escrowBalance: true, updatedAt: true },
        }),
        prisma.campaignApplication.findMany({
          where: { influencer: { userId } },
          include: { campaign: { select: { title: true, createdAt: true } } },
          orderBy: { appliedAt: "desc" },
        }),
        prisma.deliverable.findMany({
          where: { influencer: { userId } },
          select: { id: true, status: true, createdAt: true, campaign: { select: { title: true } } },
          orderBy: { createdAt: "desc" },
        }),
        prisma.financialTransaction.findMany({
          where: { wallet: { userId } },
          orderBy: { createdAt: "desc" },
          take: 8,
          select: { id: true, type: true, amount: true, createdAt: true, note: true, referenceId: true },
        }),
      ])
    : [null, null, [], [], []];

  const accepted = applications.filter((x) => x.status === ApplicationStatus.ACCEPTED).length;
  const total = applications.length;
  const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 0;
  const last30Accepted = applications.filter((x) => x.status === ApplicationStatus.ACCEPTED && x.appliedAt >= thirtyDaysAgo).length;
  const approvedDeliverables = deliverables.filter((d) => d.status === DeliverableStatus.APPROVED).length;
  const pendingDeliverables = deliverables.filter((d) => d.status !== DeliverableStatus.APPROVED).length;
  const monthlyPayout = recentTransactions
    .filter((t) => t.type === FinancialTxnType.CAMPAIGN_ESCROW_RELEASE && t.amount > 0 && t.createdAt >= thirtyDaysAgo)
    .reduce((sum, t) => sum + t.amount, 0);

  const statusTone: Record<ApplicationStatus, string> = {
    ACCEPTED: "text-emerald-700 bg-emerald-50",
    PENDING: "text-amber-700 bg-amber-50",
    REJECTED: "text-rose-700 bg-rose-50",
    SHORTLISTED: "text-blue-700 bg-blue-50",
    WITHDRAWN: "text-gray-700 bg-gray-100",
  };

  return (
    <div className="mx-auto max-w-[1150px] space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-hero text-2xl font-bold text-gray-900">Influencer Rapor Ekrani</h2>
            <p className="mt-1 text-sm text-gray-700">
              {influencer?.handle ?? "Influencer"} · {influencer?.category ?? "-"} ·{" "}
              <abbr className="cursor-help border-b border-dotted border-gray-400 no-underline" title="Etkileşim Oranı">
                ER
              </abbr>{" "}
              %{(influencer?.engagementRate ?? 0).toFixed(1)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-800">
            Son güncelleme: {wallet?.updatedAt ? new Date(wallet.updatedAt).toLocaleString("tr-TR") : "-"}
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-[11px] uppercase tracking-wide text-gray-500">Toplam basvuru</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{total}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-[11px] uppercase tracking-wide text-gray-500">Kabul orani</p>
            <p className="mt-1 text-2xl font-bold text-emerald-700">%{acceptanceRate}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-[11px] uppercase tracking-wide text-gray-500">
              Son{" "}
              <abbr className="cursor-help border-b border-dotted border-gray-400 no-underline" title="Son 30 gün">
                30g
              </abbr>{" "}
              yeni kabul
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{last30Accepted}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-[11px] uppercase tracking-wide text-gray-500">
              Aylık ödeme (
              <abbr className="cursor-help border-b border-dotted border-gray-400 no-underline" title="Son 30 gün">
                30g
              </abbr>
              )
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{monthlyPayout.toLocaleString("tr-TR")} TL</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-[11px] uppercase tracking-wide text-gray-500">Cuzdan</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{(wallet?.balance ?? 0).toLocaleString("tr-TR")} TL</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-hero text-lg font-bold text-gray-900">Basvuru Dagilimi</h3>
          <div className="mt-3 space-y-2">
            {Object.values(ApplicationStatus).map((status) => {
              const count = applications.filter((a) => a.status === status).length;
              return (
                <div key={status} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusTone[status]}`}>{status}</span>
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-gray-600">
            Onayli icerik: <strong>{approvedDeliverables}</strong> · Bekleyen/revize: <strong>{pendingDeliverables}</strong>
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-hero text-lg font-bold text-gray-900">Son Finans Hareketleri</h3>
          <ul className="mt-3 space-y-2">
            {recentTransactions.length ? (
              recentTransactions.map((t) => (
                <li key={t.id} className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900">{t.type}</p>
                    <p className={`text-sm font-bold ${t.amount >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                      {t.amount >= 0 ? "+" : ""}
                      {t.amount.toLocaleString("tr-TR")} TL
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">{new Date(t.createdAt).toLocaleString("tr-TR")}</p>
                  {t.note ? <p className="mt-1 text-xs text-gray-500">{t.note}</p> : null}
                </li>
              ))
            ) : (
              <li className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 text-xs text-gray-600">Henuz finans hareketi yok.</li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
