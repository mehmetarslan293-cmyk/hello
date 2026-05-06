"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/panel/influencer": "Genel Bakış",
  "/panel/influencer/trend-videolar": "Trend Videolar",
  "/panel/influencer/top-influencerlar": "Top Influencerlar",
  "/panel/influencer/sosyal-hesaplar": "Sosyal hesaplar",
  "/panel/influencer/trend-analizi": "Trend Analizi",
  "/panel/influencer/tekliflerim": "Tekliflerim",
  "/panel/influencer/iceriklerim": "İçeriklerim",
  "/panel/influencer/mesajlar": "Mesajlar",
  "/panel/influencer/islem-gecmisi": "Islem gecmisi",
  "/panel/influencer/bakiye": "Bakiye",
};

export function InfluencerPanelHeader() {
  const pathname = usePathname();
  const title = pathname.startsWith("/panel/influencer/iceriklerim")
    ? "İçeriklerim"
    : titles[pathname] ?? "Influencer Paneli";
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadNotifications() {
      try {
        const res = await fetch("/api/influencer/notifications", { credentials: "include", cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !active) return;
        setUnreadCount(typeof data.unreadCount === "number" ? data.unreadCount : 0);
      } catch {
        if (active) setUnreadCount(0);
      }
    }

    loadNotifications();
    return () => {
      active = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur-md md:px-8">
      <h1 className="font-hero text-lg font-bold text-gray-900 md:text-2xl">{title}</h1>
      <div className="flex items-center gap-2">
        <button className="relative rounded-full border border-gray-200 bg-white p-2 text-gray-700 hover:bg-gray-50" aria-label="Bildirimler">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
            <path d="M9.5 17a2.5 2.5 0 0 0 5 0" />
          </svg>
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </button>
        <div className="rounded-full bg-pink-600 px-2.5 py-1 text-xs font-bold text-white">J</div>
      </div>
    </header>
  );
}
