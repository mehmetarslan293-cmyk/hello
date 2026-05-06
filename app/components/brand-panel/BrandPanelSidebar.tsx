"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HelloBubbleLogo } from "@/app/components/HelloBubbleLogo";

type NavItem = { href: string; label: string; badge?: string };

const mainNav: NavItem[] = [
  { href: "/panel/marka", label: "Genel bakış" },
  { href: "/panel/marka/is-birlikleri", label: "Teklif & iş akışı" },
  { href: "/panel/marka/araclar/influencer-kesfet", label: "Influencer keşfet" },
  { href: "/panel/marka/influencerlarim", label: "Influencerlarım" },
  { href: "/panel/marka/mesajlar", label: "Mesajlar" },
  { href: "/panel/marka/islem-gecmisi", label: "İşlem geçmişi" },
  { href: "/panel/marka/bakiye-yukle", label: "Bakiye yükle" },
  { href: "/panel/marka/faturalar", label: "Faturalar & ödemeler" },
];

export function BrandPanelSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

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

  const active = (href: string) =>
    href === "/panel/marka" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <button
        type="button"
        className="fixed bottom-5 left-5 z-40 flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-800 shadow-lg lg:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menü"
      >
        {open ? "✕" : "☰"}
      </button>

      <aside
        className={[
          "fixed inset-y-0 left-0 z-30 flex w-[260px] shrink-0 flex-col border-r border-gray-800 bg-[#0f1419] lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="border-b border-white/10 px-5 py-6">
          <HelloBubbleLogo href="/panel/marka" textClassName="text-white" />
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-pink-400">Marka paneli</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {mainNav.map((item) => {
              const badge =
                item.href === "/panel/marka/mesajlar" && unreadMessages > 0 ? String(unreadMessages) : item.badge;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
                      active(item.href)
                        ? "bg-pink-500/15 text-pink-300 shadow-[inset_3px_0_0_0_#ec4899]"
                        : "text-gray-400 hover:bg-white/5 hover:text-white",
                    ].join(" ")}
                  >
                    <span>{item.label}</span>
                    {badge ? (
                      <span className="rounded-full bg-pink-500/25 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-pink-200">
                        {badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            className="block rounded-xl px-3 py-2 text-[12px] text-gray-500 hover:text-white"
            onClick={() => setOpen(false)}
          >
            ← Ana siteye dön
          </Link>
          <Link href="/giris/marka" className="mt-1 block rounded-xl px-3 py-2 text-[12px] text-gray-500 hover:text-white">
            Çıkış (demo)
          </Link>
        </div>
      </aside>

      {open ? (
        <button type="button" className="fixed inset-0 z-20 bg-black/50 lg:hidden" aria-label="Kapat" onClick={() => setOpen(false)} />
      ) : null}
    </>
  );
}
