"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function BakiyePage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [iban, setIban] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/influencer/dashboard", { credentials: "include", cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data?.ok || !active) return;
        const b = data.wallet?.balance;
        setBalance(typeof b === "number" ? b : 0);
      } catch {
        if (active) setBalance(null);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, []);

  async function submitWithdraw() {
    const n = Number(amount);
    if (!Number.isFinite(n) || n < 40) {
      setInfo("Minimum 40 TRY cekim.");
      return;
    }
    if (!iban.trim()) {
      setInfo("IBAN zorunlu.");
      return;
    }
    try {
      setBusy(true);
      setInfo("");
      const res = await fetch("/api/wallets/withdrawals", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: n, iban: iban.trim(), note: note.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Talep gonderilemedi");
      setInfo(data?.message ?? "Talep olusturuldu.");
      setAmount("");
      setIban("");
      setNote("");
      if (typeof data.balanceAfter === "number") setBalance(data.balanceAfter);
    } catch (e) {
      setInfo(e instanceof Error ? e.message : "Hata");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-[820px] space-y-6">
      <div className="rounded-2xl bg-[#ff5c70] p-6 text-white shadow-sm">
        <p className="text-sm opacity-90">Toplam Kazancin</p>
        <p className="font-hero mt-1 text-4xl font-bold">
          {balance == null ? "…" : `${balance.toLocaleString("tr-TR")} TL`}
        </p>
        <Link href="/panel/influencer/islem-gecmisi" className="mt-3 inline-block text-sm font-semibold underline opacity-95 hover:opacity-100">
          Tum islem gecmisini gor
        </Link>
      </div>

      <form
        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          void submitWithdraw();
        }}
      >
        <h3 className="font-hero text-lg font-bold text-gray-900">Para cekim talebi</h3>
        <p className="mt-1 text-sm text-gray-600">Bakiyenizden cekmek istediginiz tutari ve hesap bilgilerini girin.</p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="withdraw-amount" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Tutar (TRY)
            </label>
            <input
              id="withdraw-amount"
              type="number"
              min={40}
              step={10}
              placeholder="Orn. 500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="withdraw-iban" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              IBAN
            </label>
            <input
              id="withdraw-iban"
              type="text"
              placeholder="TR00 0000 0000 0000 0000 0000 00"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          <label htmlFor="withdraw-note" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Not (opsiyonel)
          </label>
          <textarea
            id="withdraw-note"
            placeholder="Orn. Acil odeme talebi"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[88px] w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
          />
        </div>

        {info ? <p className="mt-3 text-sm text-gray-700">{info}</p> : null}

        <button
          type="submit"
          disabled={busy}
          className="mt-4 rounded-full bg-pink-600 px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-pink-700 disabled:opacity-60"
        >
          Para cekim talebi gonder
        </button>
      </form>
    </div>
  );
}
