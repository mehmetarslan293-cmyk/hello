"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApplicationStatus } from "@prisma/client";

type OfferRow = {
  id: string;
  campaignId: string;
  campaign: string;
  brand: string;
  offerType: string;
  reward: number;
  shippingStatus: string;
  offerStatus: ApplicationStatus;
};

const offerStatusCls: Record<ApplicationStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  ACCEPTED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-rose-50 text-rose-700",
  SHORTLISTED: "bg-blue-50 text-blue-700",
  WITHDRAWN: "bg-slate-100 text-slate-700",
};

const offerStatusLabel: Record<ApplicationStatus, string> = {
  PENDING: "Beklemede",
  ACCEPTED: "Kabul edildi",
  REJECTED: "Reddedildi",
  SHORTLISTED: "Kısa liste",
  WITHDRAWN: "Geri çekildi",
};

const shippingStatusCls: Record<string, string> = {
  "Kargo bekleniyor": "bg-slate-100 text-slate-700",
  "Kargoya verildi": "bg-blue-50 text-blue-700",
  "Teslim edildi": "bg-emerald-50 text-emerald-700",
  "Iptal edildi": "bg-rose-50 text-rose-700",
};

export default function TekliflerimPage() {
  const [offers, setOffers] = useState<OfferRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOffers() {
      try {
        setLoading(true);
        const res = await fetch("/api/influencer/offers", { credentials: "include", cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "Teklifler alinamadi");
        setOffers(data.offers ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Beklenmeyen hata");
      } finally {
        setLoading(false);
      }
    }
    void loadOffers();
  }, []);

  async function updateOffer(applicationId: string, action: "accept" | "reject") {
    try {
      setUpdatingId(applicationId);
      setError(null);
      const res = await fetch("/api/influencer/offers", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Durum guncellenemedi");
      setOffers((prev) =>
        prev.map((offer) =>
          offer.id === applicationId
            ? { ...offer, offerStatus: action === "accept" ? ApplicationStatus.ACCEPTED : ApplicationStatus.REJECTED }
            : offer,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Beklenmeyen hata");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-[980px] space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">Markalardan gelen teklifleri buradan kabul edebilir, reddedebilir ve kargo durumlarini takip edebilirsin.</p>
        <Link href="/panel/influencer/iceriklerim" className="rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-xs font-semibold text-pink-700">
          Icerik gonder
        </Link>
      </div>
      {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Kampanya</th>
              <th className="px-4 py-3">Marka</th>
              <th className="px-4 py-3">Teklif</th>
              <th className="px-4 py-3 text-right">Butce</th>
              <th className="px-4 py-3">Kargo</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3 text-right">Aksiyon</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={7}>
                  Teklifler yukleniyor...
                </td>
              </tr>
            ) : offers.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={7}>
                  Henuz marka teklifi bulunmuyor.
                </td>
              </tr>
            ) : (
              offers.map((offer) => (
              <tr key={offer.id} className="border-b border-gray-50 last:border-0">
                <td className="px-4 py-3.5 font-medium text-gray-900">{offer.campaign}</td>
                <td className="px-4 py-3.5 text-gray-600">{offer.brand === "-" ? "Marka" : offer.brand}</td>
                <td className="px-4 py-3.5 text-gray-600">{offer.offerType}</td>
                <td className="px-4 py-3.5 text-right tabular-nums text-gray-900">{offer.reward > 0 ? `${offer.reward} TL` : "Barter"}</td>
                <td className="px-4 py-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${shippingStatusCls[offer.shippingStatus]}`}>
                    {offer.shippingStatus}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${offerStatusCls[offer.offerStatus] ?? "bg-slate-100 text-slate-700"}`}>
                    {offerStatusLabel[offer.offerStatus] ?? offer.offerStatus}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  {offer.offerStatus === ApplicationStatus.PENDING ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        disabled={updatingId === offer.id}
                        onClick={() => updateOffer(offer.id, "accept")}
                        className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Kabul Et
                      </button>
                      <button
                        type="button"
                        disabled={updatingId === offer.id}
                        onClick={() => updateOffer(offer.id, "reject")}
                        className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Reddet
                      </button>
                    </div>
                  ) : (
                    <span className="block text-right text-xs text-gray-400">Aksiyon tamamlandi</span>
                  )}
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
