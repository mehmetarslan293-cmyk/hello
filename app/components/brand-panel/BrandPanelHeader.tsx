"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/panel/marka": "Genel bakış",
  "/panel/marka/is-birlikleri": "Teklif ve iş akışı",
  "/panel/marka/araclar/influencer-kesfet": "Influencer keşfet",
  "/panel/marka/influencerlarim": "Influencerlarım",
  "/panel/marka/mesajlar": "Mesajlar",
  "/panel/marka/islem-gecmisi": "İşlem geçmişi",
  "/panel/marka/bakiye-yukle": "Bakiye yükle",
  "/panel/marka/faturalar": "Faturalar & ödemeler",
};

function resolveTitle(path: string): string {
  if (titles[path]) return titles[path];
  const hit = Object.keys(titles).find((k) => k !== "/panel/marka" && path.startsWith(k));
  return hit ? titles[hit] : "Marka paneli";
}

export function BrandPanelHeader() {
  const pathname = usePathname();
  const title = resolveTitle(pathname);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadBalance() {
      try {
        const res = await fetch("/api/brand/offer-balance", { credentials: "include", cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data?.ok || !active) return;
        setWalletBalance(typeof data.walletBalance === "number" ? data.walletBalance : 0);
      } catch {
        if (active) setWalletBalance(0);
      }
    }
    void loadBalance();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    async function loadUnread() {
      try {
        const res = await fetch("/api/messages", { credentials: "include", cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data?.ok || !active) return;
        setUnreadMessages(typeof data.totalUnread === "number" ? data.totalUnread : 0);
      } catch {
        if (active) setUnreadMessages(0);
      }
    }
    void loadUnread();
    return () => {
      active = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200/80 bg-white/90 px-5 py-4 backdrop-blur-md md:px-8">
      <h1 className="font-hero text-xl font-bold tracking-tight text-gray-900 md:text-2xl">{title}</h1>
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <button
          type="button"
          className="relative rounded-full border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-50"
          aria-label="Bildirimler"
        >
          <span aria-hidden className="text-lg">
            🔔
          </span>
          {unreadMessages > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadMessages > 99 ? "99+" : unreadMessages}
            </span>
          ) : null}
        </button>
        <Link
          href="/panel/marka/bakiye-yukle"
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 hover:bg-gray-100"
          title="Bakiye yükle"
        >
          <span aria-hidden>💳</span>
          <span className="text-sm font-semibold tabular-nums text-gray-900">{walletBalance.toLocaleString("tr-TR")} ₺</span>
        </Link>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-600 text-sm font-bold text-white shadow-inner"
          title="Profil"
        >
          J
        </div>
      </div>
    </header>
  );
}
