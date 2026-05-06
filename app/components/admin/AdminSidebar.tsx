"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HelloBubbleLogo } from "@/app/components/HelloBubbleLogo";

const nav = [
  { href: "/yonetici", label: "Genel bakış" },
  { href: "/yonetici/markalar", label: "Markalar & bakiye" },
  { href: "/yonetici/influencerlar", label: "Influencerlar" },
  { href: "/yonetici/kampanyalar", label: "Kampanyalar" },
  { href: "/yonetici/finans", label: "Finans & hareketler" },
  { href: "/yonetici/uyelik", label: "Üyelik istatistikleri" },
  { href: "/yonetici/destek", label: "Destek talepleri" },
  { href: "/yonetici/sistem", label: "Sistem günlüğü" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkCls = (href: string) => {
    const active = pathname === href || (href !== "/yonetici" && pathname.startsWith(href));
    return [
      "block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
      active
        ? "bg-white/[0.08] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
        : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200",
    ].join(" ");
  };

  return (
    <>
      <button
        type="button"
        className="fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-[#0a0a18] text-white shadow-xl md:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Menüyü aç / kapat"
      >
        <span className="text-lg">{open ? "✕" : "☰"}</span>
      </button>

      <aside
        className={[
          "fixed inset-y-0 left-0 z-30 w-64 shrink-0 border-r border-white/[0.06] bg-[#06060f] px-4 pb-8 pt-6 transition-transform md:relative md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <Link href="/" className="mb-8 block px-2 font-hero text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white">
          ← Siteye dön
        </Link>
        <div className="mb-8 px-2">
          <div className="mb-4">
            <HelloBubbleLogo textClassName="text-white" />
          </div>
          <p className="font-hero text-[10px] font-semibold uppercase tracking-[0.35em] text-indigo-400/90">Yönetici</p>
          <p className="mt-1 font-hero text-lg font-bold text-white">Panel</p>
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={linkCls(item.href)} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {open ? (
        <button type="button" className="fixed inset-0 z-20 bg-black/60 md:hidden" aria-label="Menüyü kapat" onClick={() => setOpen(false)} />
      ) : null}
    </>
  );
}
