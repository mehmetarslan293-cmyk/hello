"use client";

import Link from "next/link";
import { HelloBubbleLogo } from "@/app/components/HelloBubbleLogo";

export function StudioFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-black/40">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div className="lg:col-span-2">
            <p className="font-hero text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
              Bülten
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
              Yeni özellikler ve kampanya şablonlarından haberdar olun — spam yok,
              sadece özet.
            </p>
            <form
              className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                E-posta
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="ornek@marka.com"
                className="font-hero flex-1 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm text-white outline-none ring-offset-black placeholder:text-zinc-600 focus:border-white/35 focus:ring-2 focus:ring-white/15"
              />
              <button
                type="submit"
                className="font-hero rounded-full bg-white px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-zinc-200"
              >
                Abone ol
              </button>
            </form>
          </div>

          <div>
            <p className="font-hero text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
              Keşfet
            </p>
            <ul className="mt-6 space-y-3 text-sm text-zinc-400">
              <li>
                <Link href="#surec" className="transition-colors hover:text-white">
                  Süreç
                </Link>
              </li>
              <li>
                <Link href="#buybox" className="transition-colors hover:text-white">
                  Buybox
                </Link>
              </li>
              <li>
                <Link href="#ozellikler" className="transition-colors hover:text-white">
                  Platform
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-hero text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
              İletişim
            </p>
            <ul className="mt-6 space-y-3 text-sm text-zinc-400">
              <li>
                <a
                  href="mailto:merhaba@ornek.com"
                  className="transition-colors hover:text-white"
                >
                  merhaba@ornek.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:is@ornek.com"
                  className="transition-colors hover:text-white"
                >
                  is@ornek.com
                </a>
              </li>
            </ul>
            <div className="mt-8 flex gap-6 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
              <span className="cursor-default hover:text-zinc-400">X</span>
              <span className="cursor-default hover:text-zinc-400">Instagram</span>
              <span className="cursor-default hover:text-zinc-400">LinkedIn</span>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/[0.06] pt-10 text-xs text-zinc-600">
          <div className="mb-4">
            <HelloBubbleLogo textClassName="text-zinc-400" />
          </div>
          <p className="font-hero uppercase tracking-[0.15em]">© {new Date().getFullYear()} hellobubble.com.tr</p>
        </div>
      </div>
    </footer>
  );
}
