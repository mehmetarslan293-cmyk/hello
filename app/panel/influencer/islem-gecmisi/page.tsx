"use client";

import { useEffect, useMemo, useState } from "react";
import type { FinancialTxnType } from "@prisma/client";

type Tx = {
  id: string;
  type: FinancialTxnType;
  amount: number;
  balanceAfter: number;
  referenceId: string | null;
  note: string | null;
  createdAt: string;
};

const typeLabels: Partial<Record<FinancialTxnType, string>> = {
  TOPUP: "Yukleme",
  WITHDRAWAL_REQUEST: "Cekim talebi",
  WITHDRAWAL_APPROVED: "Cekim onayi",
  WITHDRAWAL_REJECTED: "Cekim red",
  CAMPAIGN_ESCROW_LOCK: "Escrow blok",
  CAMPAIGN_ESCROW_RELEASE: "Odeme / escrow",
  PLATFORM_FEE: "Platform ucreti",
  REFUND: "Iade",
};

export default function InfluencerIslemGecmisiPage() {
  const [rows, setRows] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (typeFilter) p.set("type", typeFilter);
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    const s = p.toString();
    return s ? `?${s}` : "";
  }, [typeFilter, from, to]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/wallets/transactions${qs}`, { credentials: "include", cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Veri alinamadi");
        if (active) setRows(data.transactions ?? []);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Hata");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [qs]);

  return (
    <div className="mx-auto max-w-[960px] space-y-6">
      <p className="text-sm text-gray-600">Kazanc, cekim talepleri ve kampanya odemeleri ozeti.</p>
      {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

      <div className="flex flex-wrap gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900"
        >
          <option value="">Tum turler</option>
          {(Object.keys(typeLabels) as FinancialTxnType[]).map((t) => (
            <option key={t} value={t}>
              {typeLabels[t]}
            </option>
          ))}
        </select>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2 text-sm" />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2 text-sm" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Tarih</th>
              <th className="px-4 py-3">Tur</th>
              <th className="px-4 py-3 text-right">Tutar</th>
              <th className="px-4 py-3 text-right">Bakiye sonra</th>
              <th className="px-4 py-3">Ref / Not</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Yukleniyor...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Kayit bulunamadi.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 text-gray-700">{new Date(r.createdAt).toLocaleString("tr-TR")}</td>
                  <td className="px-4 py-3">{typeLabels[r.type] ?? r.type}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium text-gray-900">
                    {r.amount.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} ₺
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-gray-600">
                    {r.balanceAfter.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} ₺
                  </td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-xs text-gray-500">{r.referenceId ?? ""} {r.note ?? ""}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
