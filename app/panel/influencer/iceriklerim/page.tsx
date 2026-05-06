"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { useEffect, useState } from "react";

type CampaignOption = {
  id: string;
  title: string;
};

export default function IceriklerimPage() {
  const [campaigns, setCampaigns] = useState<CampaignOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState("");

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/influencer/deliverables", { credentials: "include", cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Icerikler alinamadi");
      setCampaigns(data.campaigns ?? []);
    } catch (error) {
      setInfo(error instanceof Error ? error.message : "Icerikler alinamadi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="mx-auto max-w-[980px] space-y-6">
      <p className="text-sm text-gray-600">
        Once kabul ettigin kampanyayi sec. Kampanya detayina girerek video icerigi ekleyip markaya gonderebilirsin.
      </p>

      <section className="space-y-3">
        <h3 className="font-semibold text-gray-900">Kabul ettigim kampanyalar</h3>
        {loading ? <p className="text-sm text-gray-500">Yukleniyor...</p> : null}
        {info ? <p className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">{info}</p> : null}
        {!loading && !campaigns.length ? (
          <p className="rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm text-gray-500">Henuz kabul ettigin kampanya yok.</p>
        ) : null}
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/panel/influencer/iceriklerim/${campaign.id}`}
              className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm transition hover:border-pink-300 hover:bg-pink-50/30"
            >
              <span className="font-medium text-gray-900">{campaign.title}</span>
              <span className="text-sm font-semibold text-pink-600">Icerik ekle →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
