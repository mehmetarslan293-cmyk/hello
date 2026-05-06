import { ApplicationStatus, DeliverableStatus, FinancialTxnType, Role } from "@prisma/client";
import { SectionTitle } from "@/app/components/admin/StatCard";
import { prisma } from "@/lib/server/prisma";

function formatTry(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

const PLATFORM_FEE_RATE = Number.isFinite(Number(process.env.PLATFORM_FEE_RATE))
  ? Number(process.env.PLATFORM_FEE_RATE)
  : 0.1;

export default async function AdminFinansPage() {
  const [wallets, withdrawalRequests, applications, deliverables, ledger] = await Promise.all([
    prisma.wallet.findMany({
      include: {
        user: {
          select: {
            id: true,
            role: true,
            fullName: true,
            email: true,
            brandProfile: { select: { brandName: true } },
            influencerProfile: { select: { id: true, handle: true } },
          },
        },
      },
    }),
    prisma.financialTransaction.findMany({
      where: { type: FinancialTxnType.WITHDRAWAL_REQUEST },
      include: {
        wallet: {
          include: {
            user: {
              select: {
                role: true,
                fullName: true,
                email: true,
                brandProfile: { select: { brandName: true } },
                influencerProfile: { select: { id: true, handle: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    prisma.campaignApplication.findMany({
      where: { status: ApplicationStatus.ACCEPTED },
      select: { influencerId: true, offeredPrice: true, campaignId: true },
    }),
    prisma.deliverable.findMany({
      where: { status: DeliverableStatus.APPROVED },
      select: { influencerId: true, campaignId: true },
    }),
    prisma.financialTransaction.findMany({
      include: {
        wallet: {
          include: {
            user: {
              select: {
                role: true,
                fullName: true,
                brandProfile: { select: { brandName: true } },
                influencerProfile: { select: { handle: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 40,
    }),
  ]);

  const brandWallets = wallets.filter((w) => w.user.role === Role.BRAND);
  const influencerWallets = wallets.filter((w) => w.user.role === Role.INFLUENCER);

  const brandTotalBalance = brandWallets.reduce((sum, w) => sum + w.balance, 0);
  const brandTotalEscrow = brandWallets.reduce((sum, w) => sum + w.escrowBalance, 0);

  const brandWithdrawalRequests = withdrawalRequests.filter((row) => row.wallet.user.role === Role.BRAND);
  const influencerWithdrawalRequests = withdrawalRequests.filter((row) => row.wallet.user.role === Role.INFLUENCER);

  const approvedDeliverableKey = new Set(deliverables.map((d) => `${d.influencerId}:${d.campaignId}`));
  const influencerPayoutMap = new Map<string, { approved: number; pending: number }>();

  for (const app of applications) {
    const key = `${app.influencerId}:${app.campaignId}`;
    const current = influencerPayoutMap.get(app.influencerId) ?? { approved: 0, pending: 0 };
    if (approvedDeliverableKey.has(key)) {
      current.approved += app.offeredPrice;
    } else {
      current.pending += app.offeredPrice;
    }
    influencerPayoutMap.set(app.influencerId, current);
  }

  const influencerRows = influencerWallets.map((wallet) => {
    const influencerId = wallet.user.influencerProfile?.id ?? "";
    const payout = influencerPayoutMap.get(influencerId) ?? { approved: 0, pending: 0 };
    const netTransfer = Math.max(0, payout.approved * (1 - PLATFORM_FEE_RATE));
    return {
      id: wallet.id,
      handle: wallet.user.influencerProfile?.handle ?? wallet.user.fullName,
      email: wallet.user.email,
      approved: payout.approved,
      pending: payout.pending,
      netTransfer,
      balance: wallet.balance,
    };
  });

  return (
    <div className="space-y-8">
      <header>
        <p className="font-hero text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-400/90">Finans</p>
        <h1 className="font-hero mt-2 text-3xl font-bold tracking-tight text-white md:text-[2rem]">Finans & hareketler</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Marka bakiyesi + blokeli para ve influencer çekim talepleri dinamik olarak listelenir.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200/80">Marka güncel bakiye toplamı</p>
          <p className="mt-2 font-hero text-2xl font-bold text-white">{formatTry(brandTotalBalance)}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Marka blokeli bakiye (escrow)</p>
          <p className="mt-2 font-hero text-2xl font-bold text-zinc-100">{formatTry(brandTotalEscrow)}</p>
        </div>
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.08] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-200/90">Aktif çekim talepleri</p>
          <p className="mt-2 font-hero text-2xl font-bold text-white">{brandWithdrawalRequests.length + influencerWithdrawalRequests.length}</p>
        </div>
      </div>

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
        <SectionTitle title="Marka çekim talepleri" subtitle="Marka bazında güncel bakiye ve blokeli tutar ile birlikte listelenir." />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wide text-zinc-500">
                <th className="pb-3 pr-4 font-semibold">Marka</th>
                <th className="pb-3 pr-4 font-semibold">Çekim talebi</th>
                <th className="pb-3 pr-4 font-semibold text-right">Güncel bakiye</th>
                <th className="pb-3 pr-4 font-semibold text-right">Blokeli bakiye</th>
                <th className="pb-3 pr-4 font-semibold">Talep zamanı</th>
                <th className="pb-3 font-semibold">Not</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {brandWithdrawalRequests.length ? (
                brandWithdrawalRequests.map((row) => (
                  <tr key={row.id} className="border-b border-white/[0.04]">
                    <td className="py-3 pr-4 font-medium text-white">
                      {row.wallet.user.brandProfile?.brandName ?? row.wallet.user.fullName}
                    </td>
                    <td className="py-3 pr-4 font-semibold text-amber-300">{formatTry(Math.abs(row.amount))}</td>
                    <td className="py-3 pr-4 text-right tabular-nums text-emerald-300">{formatTry(row.wallet.balance)}</td>
                    <td className="py-3 pr-4 text-right tabular-nums text-zinc-300">{formatTry(row.wallet.escrowBalance)}</td>
                    <td className="py-3 pr-4 whitespace-nowrap text-zinc-500">{row.createdAt.toLocaleString("tr-TR")}</td>
                    <td className="py-3 text-xs text-zinc-400">{row.note ?? "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-4 text-sm text-zinc-500" colSpan={6}>
                    Aktif marka çekim talebi bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
        <SectionTitle
          title="Influencer aktif çekim talepleri"
          subtitle={`Onaylı bakiye, onay bekleyen bakiye ve %${Math.round(PLATFORM_FEE_RATE * 100)} hizmet bedeli sonrası net transfer tutarı.`}
        />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wide text-zinc-500">
                <th className="pb-3 pr-4 font-semibold">Influencer</th>
                <th className="pb-3 pr-4 font-semibold">Çekim talebi</th>
                <th className="pb-3 pr-4 font-semibold text-right">Onaylanan bakiye</th>
                <th className="pb-3 pr-4 font-semibold text-right">Onay bekleyen bakiye</th>
                <th className="pb-3 pr-4 font-semibold text-right">Net transfer (hizmet bedeli sonrası)</th>
                <th className="pb-3 pr-4 font-semibold text-right">Cüzdan</th>
                <th className="pb-3 font-semibold">Talep zamanı</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {influencerWithdrawalRequests.length ? (
                influencerWithdrawalRequests.map((row) => {
                  const meta =
                    influencerRows.find((i) => i.email === row.wallet.user.email) ??
                    ({ approved: 0, pending: 0, netTransfer: 0, balance: row.wallet.balance, handle: row.wallet.user.fullName } as const);
                  return (
                    <tr key={row.id} className="border-b border-white/[0.04]">
                      <td className="py-3 pr-4 font-medium text-white">{meta.handle}</td>
                      <td className="py-3 pr-4 font-semibold text-amber-300">{formatTry(Math.abs(row.amount))}</td>
                      <td className="py-3 pr-4 text-right tabular-nums text-emerald-300">{formatTry(meta.approved)}</td>
                      <td className="py-3 pr-4 text-right tabular-nums text-zinc-300">{formatTry(meta.pending)}</td>
                      <td className="py-3 pr-4 text-right tabular-nums font-semibold text-indigo-300">{formatTry(meta.netTransfer)}</td>
                      <td className="py-3 pr-4 text-right tabular-nums text-zinc-300">{formatTry(meta.balance)}</td>
                      <td className="py-3 whitespace-nowrap text-zinc-500">{row.createdAt.toLocaleString("tr-TR")}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="py-4 text-sm text-zinc-500" colSpan={7}>
                    Aktif influencer çekim talebi bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
        <SectionTitle title="Ledger" subtitle="Yükleme, escrow hareketi, hakediş ve komisyon satırları." />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wide text-zinc-500">
                <th className="pb-3 pr-4 font-semibold">Zaman</th>
                <th className="pb-3 pr-4 font-semibold">Tür</th>
                <th className="pb-3 pr-4 font-semibold">Taraf</th>
                <th className="pb-3 pr-4 font-semibold text-right">Tutar</th>
                <th className="pb-3 font-semibold text-right">Ref. bakiye</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {ledger.map((row) => (
                <tr key={row.id} className="border-b border-white/[0.04]">
                  <td className="py-3 pr-4 whitespace-nowrap text-zinc-500">{row.createdAt.toLocaleString("tr-TR")}</td>
                  <td className="py-3 pr-4">{row.type.replace("_", " ")}</td>
                  <td className="py-3 pr-4">
                    {row.wallet.user.brandProfile?.brandName ??
                      row.wallet.user.influencerProfile?.handle ??
                      row.wallet.user.fullName}
                  </td>
                  <td className={`py-3 pr-4 text-right font-medium tabular-nums ${row.amount >= 0 ? "text-emerald-400" : "text-rose-300"}`}>
                    {row.amount >= 0 ? "+" : ""}
                    {formatTry(row.amount)}
                  </td>
                  <td className="py-3 text-right tabular-nums text-zinc-400">{formatTry(row.balanceAfter)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
