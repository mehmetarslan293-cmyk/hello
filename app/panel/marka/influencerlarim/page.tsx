"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";

type RatingLog = { id: string; rating: number; note: string | null; createdAt: string };

type Row = {
  id: string;
  title: string;
  createdAt: string;
  contentUrl: string | null;
  caption: string | null;
  reviewNote: string | null;
  brandRating: number | null;
  ratedAt: string | null;
  status: "SUBMITTED" | "REVISION_REQUESTED" | "APPROVED";
  campaign: { id: string; title: string };
  influencer: { id: string; handle: string | null; city: string | null };
  ratingLogs?: RatingLog[];
};

function parseLegacyReview(value: string | null, brandRating: number | null) {
  if (brandRating != null && brandRating >= 1 && brandRating <= 5) {
    const noteMatch = value?.match(/NOTE:(.*)$/);
    return { note: noteMatch?.[1]?.trim() || "Not yok", rating: brandRating as number };
  }
  if (!value) return { note: "Not yok", rating: null as number | null };
  const ratingMatch = value.match(/RATING:(\d)/);
  const noteMatch = value.match(/NOTE:(.*)$/);
  return {
    rating: ratingMatch ? Number(ratingMatch[1]) : null,
    note: noteMatch?.[1]?.trim() || (ratingMatch ? "Not yok" : value),
  };
}

function isRatedRow(r: Row) {
  if (r.brandRating != null && r.brandRating >= 1) return true;
  if (r.ratingLogs && r.ratingLogs.length > 0) return true;
  return Boolean(r.reviewNote?.includes("RATING:"));
}

export default function InfluencerlarimPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [noteById, setNoteById] = useState<Record<string, string>>({});
  const [ratingById, setRatingById] = useState<Record<string, number>>({});
  const [info, setInfo] = useState("");
  const [activeCampaignId, setActiveCampaignId] = useState<string>("");
  const [ratingFilter, setRatingFilter] = useState<"all" | "rated" | "unrated">("all");

  async function loadRows() {
    setLoading(true);
    try {
      const res = await fetch("/api/brand/deliverables", { credentials: "include", cache: "no-store" });
      const data = await res.json();
      if (data?.ok) setRows(data.deliverables ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRows();
  }, []);

  async function review(deliverableId: string, action: "approve" | "revision") {
    try {
      setBusyId(deliverableId);
      setInfo("");
      const res = await fetch("/api/deliverables/review", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliverableId,
          action,
          note: noteById[deliverableId] ?? "",
          rating: action === "approve" ? ratingById[deliverableId] ?? 5 : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "Islem basarisiz");
      }
      setInfo(action === "approve" ? "Icerik kabul edildi." : "Revize talebi gonderildi.");
      await loadRows();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Islem basarisiz";
      setInfo(message);
    } finally {
      setBusyId(null);
    }
  }

  const submittedRows = useMemo(() => rows.filter((r) => r.status === "SUBMITTED"), [rows]);

  const historyCampaigns = useMemo(() => {
    const map = new Map<string, { id: string; title: string }>();
    rows
      .filter((r) => r.status !== "SUBMITTED")
      .forEach((r) => {
        if (!map.has(r.campaign.id)) {
          map.set(r.campaign.id, { id: r.campaign.id, title: r.campaign.title });
        }
      });
    return Array.from(map.values());
  }, [rows]);

  useEffect(() => {
    if (!activeCampaignId && historyCampaigns.length) {
      setActiveCampaignId(historyCampaigns[0].id);
    }
    if (activeCampaignId && !historyCampaigns.some((c) => c.id === activeCampaignId)) {
      setActiveCampaignId(historyCampaigns[0]?.id ?? "");
    }
  }, [historyCampaigns, activeCampaignId]);

  const latestHistoryRows = useMemo(() => {
    const map = new Map<string, Row>();
    rows
      .filter((r) => r.status !== "SUBMITTED" && (!activeCampaignId || r.campaign.id === activeCampaignId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .forEach((r) => {
        if (!map.has(r.influencer.id)) map.set(r.influencer.id, r);
      });
    const list = Array.from(map.values());
    if (ratingFilter === "rated") return list.filter((r) => isRatedRow(r));
    if (ratingFilter === "unrated") return list.filter((r) => !isRatedRow(r));
    return list;
  }, [rows, activeCampaignId, ratingFilter]);

  async function rateInfluencer(deliverableId: string) {
    try {
      setBusyId(deliverableId);
      setInfo("");
      const res = await fetch("/api/deliverables/review", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliverableId,
          action: "rate",
          rating: ratingById[deliverableId] ?? 5,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Degerlendirme kaydedilemedi");
      setInfo("Influencer yildiz degerlendirmesi kaydedildi.");
      await loadRows();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Degerlendirme kaydedilemedi";
      setInfo(message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-[980px] space-y-6">
      <p className="text-sm text-gray-600">
        Influencerlarin gonderdigi icerikleri bu ekranda degerlendirin; kabul edin veya revize isteyin.
      </p>
      {info ? <p className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">{info}</p> : null}

      <section className="space-y-4">
        <h2 className="font-semibold text-gray-900">Onay bekleyen icerikler</h2>
        {loading ? <p className="text-sm text-gray-500">Yukleniyor...</p> : null}
        {!loading && !submittedRows.length ? (
          <p className="rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm text-gray-500">Su an onay bekleyen teslim yok.</p>
        ) : null}

        {submittedRows.map((row) => (
          <article key={row.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-gray-900">{row.influencer.handle ?? "Influencer"}</p>
              <p className="text-xs text-gray-500">{row.campaign.title}</p>
            </div>
            <p className="mt-2 text-sm text-gray-600">{row.caption || "Aciklama girilmemis."}</p>
            <p className="mt-1 text-xs text-gray-500">Konum: {row.influencer.city || "-"}</p>
            {row.contentUrl ? (
              <div className="mt-3 space-y-2">
                <video className="w-full rounded-xl border border-gray-100 bg-black/80 md:max-h-80" controls src={row.contentUrl} />
                <a
                  href={row.contentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-sm font-medium text-pink-600 underline-offset-2 hover:underline"
                >
                  Icerigi yeni sekmede ac
                </a>
              </div>
            ) : null}
            <textarea
              value={noteById[row.id] ?? ""}
              onChange={(e) => setNoteById((prev) => ({ ...prev, [row.id]: e.target.value }))}
              placeholder="Revize notu (opsiyonel)"
              className="mt-3 min-h-20 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
            <label className="mt-3 block text-xs text-gray-600">
              Basari yildizi (onayda etkili)
              <select
                value={ratingById[row.id] ?? 5}
                onChange={(e) => setRatingById((prev) => ({ ...prev, [row.id]: Number(e.target.value) }))}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-pink-400"
              >
                <option value={5}>5 yildiz</option>
                <option value={4}>4 yildiz</option>
                <option value={3}>3 yildiz</option>
                <option value={2}>2 yildiz</option>
                <option value={1}>1 yildiz</option>
              </select>
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busyId === row.id}
                onClick={() => void review(row.id, "approve")}
                className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                Kabul et
              </button>
              <button
                type="button"
                disabled={busyId === row.id}
                onClick={() => void review(row.id, "revision")}
                className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-amber-700 hover:bg-amber-100 disabled:opacity-60"
              >
                Revize iste
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-semibold text-gray-900">Gecmis degerlendirmeler (son video)</h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRatingFilter("all")}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                ratingFilter === "all" ? "bg-pink-600 text-white" : "border border-gray-200 bg-white text-gray-700"
              }`}
            >
              Tumu
            </button>
            <button
              type="button"
              onClick={() => setRatingFilter("rated")}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                ratingFilter === "rated" ? "bg-pink-600 text-white" : "border border-gray-200 bg-white text-gray-700"
              }`}
            >
              Degerlendirildi
            </button>
            <button
              type="button"
              onClick={() => setRatingFilter("unrated")}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                ratingFilter === "unrated" ? "bg-pink-600 text-white" : "border border-gray-200 bg-white text-gray-700"
              }`}
            >
              Degerlendirilmedi
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {historyCampaigns.map((campaign) => (
            <button
              key={campaign.id}
              type="button"
              onClick={() => setActiveCampaignId(campaign.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                activeCampaignId === campaign.id
                  ? "bg-pink-600 text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {campaign.title}
            </button>
          ))}
        </div>
        <div className="mt-3 space-y-2">
          {!historyCampaigns.length ? (
            <p className="rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm text-gray-500">Gecmis degerlendirme bulunmuyor.</p>
          ) : null}
          {historyCampaigns.length > 0 && latestHistoryRows.length === 0 ? (
            <p className="rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm text-gray-500">Bu filtreye uygun kayit yok.</p>
          ) : null}
          {latestHistoryRows.map((r) => {
            const parsed = parseLegacyReview(r.reviewNote, r.brandRating);
            return (
              <div key={`history-${r.id}`} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm">
                <p className="font-medium text-gray-900">
                  {r.influencer.handle ?? "Influencer"} · {r.status === "APPROVED" ? "Kabul edildi" : "Revize istendi"}
                </p>
                <p className="text-xs text-gray-600">{parsed.note}</p>
                {parsed.rating ? <p className="mt-1 text-xs font-semibold text-amber-700">Yıldız: {parsed.rating}/5</p> : null}
                {r.ratingLogs && r.ratingLogs.length > 0 ? (
                  <ul className="mt-2 space-y-1 border-t border-gray-200 pt-2 text-[11px] text-gray-600">
                    {r.ratingLogs.map((log) => (
                      <li key={log.id}>
                        {new Date(log.createdAt).toLocaleString("tr-TR")}: {log.rating}/5
                        {log.note ? ` — ${log.note}` : ""}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {r.status === "APPROVED" ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <select
                      value={ratingById[r.id] ?? parsed.rating ?? 5}
                      onChange={(e) => setRatingById((prev) => ({ ...prev, [r.id]: Number(e.target.value) }))}
                      className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-900"
                    >
                      <option value={5}>5 yildiz</option>
                      <option value={4}>4 yildiz</option>
                      <option value={3}>3 yildiz</option>
                      <option value={2}>2 yildiz</option>
                      <option value={1}>1 yildiz</option>
                    </select>
                    <button
                      type="button"
                      disabled={busyId === r.id}
                      onClick={() => void rateInfluencer(r.id)}
                      className="rounded-full border border-pink-300 bg-pink-50 px-3 py-1.5 text-xs font-semibold text-pink-700 disabled:opacity-60"
                    >
                      Influenceri Degerlendir
                    </button>
                  </div>
                ) : null}
                {r.contentUrl ? (
                  <div className="mt-2 space-y-2">
                    <video className="w-full rounded-xl border border-gray-100 bg-black/80 md:max-h-72" controls src={r.contentUrl} />
                    <a
                      href={r.contentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-xs font-medium text-pink-600 underline-offset-2 hover:underline"
                    >
                      Videoyu yeni sekmede ac
                    </a>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
