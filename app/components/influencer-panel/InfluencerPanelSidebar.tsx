"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { HelloBubbleLogo } from "@/app/components/HelloBubbleLogo";

type NavEntry = { href: string; label: string; badge?: string };

const nav: NavEntry[] = [
  { href: "/panel/influencer", label: "Dashboard" },
  { href: "/panel/influencer/top-influencerlar", label: "Top Influencerlar", badge: "YENİ" },
  { href: "/panel/influencer/sosyal-hesaplar", label: "Sosyal hesaplar" },
  { href: "/panel/influencer/tekliflerim", label: "Tekliflerim" },
  { href: "/panel/influencer/iceriklerim", label: "İçeriklerim" },
  { href: "/panel/influencer/mesajlar", label: "Mesajlar" },
  { href: "/panel/influencer/islem-gecmisi", label: "Islem gecmisi" },
  { href: "/panel/influencer/bakiye", label: "Bakiye" },
];

export function InfluencerPanelSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadUnread() {
      try {
        const res = await fetch("/api/messages", { credentials: "include", cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data?.ok || !active) return;
        const total = typeof data.totalUnread === "number" ? data.totalUnread : 0;
        setUnreadMessageCount(total);
      } catch {
        if (active) setUnreadMessageCount(0);
      }
    }
    void loadUnread();
    return () => {
      active = false;
    };
  }, []);

  const navItems = useMemo(
    () =>
      nav.map((item) =>
        item.href === "/panel/influencer/mesajlar"
          ? { ...item, badge: unreadMessageCount > 0 ? String(unreadMessageCount) : undefined }
          : item,
      ),
    [unreadMessageCount],
  );

  const isActive = (href: string) => (href === "/panel/influencer" ? pathname === href : pathname.startsWith(href));

  return (
    <>
      <button
        type="button"
        className="fixed bottom-4 left-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-900 shadow-md lg:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
      >
        {open ? "X" : "="}
      </button>

      <aside
        className={[
          "fixed inset-y-0 left-0 z-30 w-64 shrink-0 border-r border-white/10 bg-[#0f1419] text-white lg:static",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "transition-transform",
        ].join(" ")}
      >
        <div className="border-b border-white/10 px-5 py-6">
          <HelloBubbleLogo href="/panel/influencer" textClassName="text-white" />
          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-pink-400">Influencer paneli</p>
        </div>

        <nav className="space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={[
                "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors",
                isActive(item.href)
                  ? "bg-pink-500/20 text-pink-200"
                  : "text-gray-300 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              <span>{item.label}</span>
              {item.badge ? <span className="rounded-full bg-pink-600 px-2 py-0.5 text-[10px]">{item.badge}</span> : null}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link href="/" className="block rounded-lg px-2 py-2 text-xs text-gray-400 hover:text-white">Ana site</Link>
        </div>
      </aside>

      {open ? <button className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setOpen(false)} /> : null}
    </>
  );
}
