"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";

type DeliverableRow = {
  id: string;
  contentUrl: string | null;
  caption: string | null;
  reviewNote: string | null;
  status: "SUBMITTED" | "REVISION_REQUESTED" | "APPROVED";
  campaign: { id: string; title: string };
};

type SelectedCampaign = {
  id: string;
  title: string;
} | null;

const statusLabel: Record<DeliverableRow["status"], string> = {
  SUBMITTED: "Onay bekliyor",
  REVISION_REQUESTED: "Revize istendi",
  APPROVED: "Onaylandi",
};

const statusCls: Record<DeliverableRow["status"], string> = {
  SUBMITTED: "bg-amber-50 text-amber-700",
  REVISION_REQUESTED: "bg-rose-50 text-rose-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
};

export default function CampaignContentPage() {
  const params = useParams<{ campaignId: string }>();
  const campaignId = params.campaignId;
  const [selectedCampaign, setSelectedCampaign] = useState<SelectedCampaign>(null);
  const [rows, setRows] = useState<DeliverableRow[]>([]);
  const [caption, setCaption] = useState("");
  const [contentUrl, setContentUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [info, setInfo] = useState("");

  async function load() {
    try {
      setLoading(true);
      const res = await fetch(`/api/influencer/deliverables?campaignId=${campaignId}`, { credentials: "include", cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Icerikler alinamadi");
      setSelectedCampaign(data.selectedCampaign ?? null);
      setRows(data.deliverables ?? []);
    } catch (error) {
      setInfo(error instanceof Error ? error.message : "Icerikler alinamadi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [campaignId]);

  async function submitDeliverable(e: FormEvent) {
    e.preventDefault();
    try {
      setSending(true);
      setInfo("");
      const form = new FormData();
      form.append("campaignId", campaignId);
      form.append("caption", caption);
      form.append("contentUrl", contentUrl);
      if (videoFile) form.append("video", videoFile);

      const res = await fetch("/api/influencer/deliverables", {
        credentials: "include",
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Icerik gonderilemedi");
      setCaption("");
      setContentUrl("");
      setVideoFile(null);
      setInfo("Video icerigi markaya gonderildi.");
      await load();
    } catch (error) {
      setInfo(error instanceof Error ? error.message : "Icerik gonderilemedi");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-[980px] space-y-6">
      <Link href="/panel/influencer/iceriklerim" className="inline-flex text-sm font-semibold text-pink-600 hover:text-pink-700">
        ← Kampanya listesine don
      </Link>
      <p className="text-sm text-gray-600">
        {selectedCampaign ? `${selectedCampaign.title} kampanyasi icin video icerik ekle ve markaya gonder.` : "Kampanya bilgisi yukleniyor..."}
      </p>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">Video icerik gonder</h2>
        <form onSubmit={submitDeliverable} className="mt-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-gray-700">Video dosyasi (MP4/MOV)</span>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 file:mr-3 file:rounded-lg file:border-0 file:bg-pink-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-pink-700"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-gray-700">Video linki (opsiyonel)</span>
              <input
                type="url"
                value={contentUrl}
                onChange={(e) => setContentUrl(e.target.value)}
                placeholder="https://... (video linki)"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-pink-400"
              />
            </label>
          </div>

          <label className="block space-y-1 text-sm">
            <span className="text-gray-700">Aciklama / not</span>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Icerik notu ve brief detaylari"
              className="min-h-20 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-pink-400"
            />
          </label>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={sending || !selectedCampaign}
              className="rounded-full bg-pink-600 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white disabled:opacity-60"
            >
              {sending ? "Gonderiliyor..." : "Markaya Gonder"}
            </button>
            {info ? <p className="text-sm text-gray-600">{info}</p> : null}
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold text-gray-900">Bu kampanyadaki gonderimlerim</h3>
        {loading ? <p className="text-sm text-gray-500">Yukleniyor...</p> : null}
        {!loading && !rows.length ? (
          <p className="rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm text-gray-500">Bu kampanya icin henuz icerik gondermedin.</p>
        ) : null}
        {rows.map((row) => (
          <article key={row.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-gray-900">{row.campaign.title}</p>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusCls[row.status]}`}>{statusLabel[row.status]}</span>
            </div>
            {row.contentUrl ? <video className="mt-3 w-full rounded-xl border border-gray-100 bg-black/80 md:max-h-80" controls src={row.contentUrl} /> : null}
            <p className="mt-2 text-sm text-gray-600">{row.caption || "Aciklama yok."}</p>
            {row.reviewNote ? <p className="mt-1 text-xs font-medium text-rose-700">Marka notu: {row.reviewNote}</p> : null}
          </article>
        ))}
      </section>
    </div>
  );
}
