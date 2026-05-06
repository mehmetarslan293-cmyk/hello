"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HelloBubbleLogo } from "@/app/components/HelloBubbleLogo";

const links = [
  { href: "#yaklasim", label: "Yaklaşım" },
  { href: "#buybox", label: "Öne çıkanlar" },
  { href: "#surec", label: "Süreç" },
  { href: "#ozellikler", label: "Platform" },
];

export function GlassNavbar() {
  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.06] bg-black/45 backdrop-blur-xl"
    >
      <nav
        className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4 md:px-10"
        role="navigation"
        aria-label="Ana menü"
      >
        <HelloBubbleLogo
          className="group"
          textClassName="hidden text-zinc-400 transition-colors group-hover:text-white sm:inline"
        />

        <ul className="hidden flex-1 flex-wrap items-center justify-center gap-8 lg:flex">
          {links.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-[13px] font-medium uppercase tracking-[0.14em] text-zinc-500 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/giris/marka"
            className="rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400 transition-colors hover:text-white sm:text-xs"
          >
            Marka
          </Link>
          <Link
            href="/giris/influencer"
            className="rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400 transition-colors hover:text-violet-300 sm:text-xs"
          >
            Influencer
          </Link>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="#cta"
              className="rounded-full border border-white/90 bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-black transition-colors hover:bg-zinc-200 sm:text-xs"
            >
              Konuşalım
            </Link>
          </motion.div>
        </div>
      </nav>
    </motion.header>
  );
}
