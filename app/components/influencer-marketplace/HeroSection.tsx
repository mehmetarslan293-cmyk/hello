"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useId, useRef } from "react";
import Link from "next/link";

function InstagramGlyph({ className }: { className?: string }) {
  const gid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <linearGradient id={`ig-${gid}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="50%" stopColor="#e6683c" />
          <stop offset="100%" stopColor="#bc3088" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        fill="none"
        stroke={`url(#ig-${gid})`}
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke={`url(#ig-${gid})`} strokeWidth="1.6" />
      <circle cx="17.5" cy="6.5" r="1.2" fill={`url(#ig-${gid})`} />
    </svg>
  );
}

function TikTokGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <path
        d="M15.6 4.2v2.4c1 .1 2 .6 2.7 1.3.8.8 1.3 1.9 1.3 3.1v1.8h-2.7v-1.6c0-.7-.3-1.3-.8-1.8-.5-.5-1.2-.8-2-.8h-.8v9.4c0 1.8-1.5 3.3-3.3 3.3a3.3 3.3 0 01-3.3-3.3 3.3 3.3 0 013.3-3.3h1V12h-1a5.4 5.4 0 00-5.4 5.4 5.4 5.4 0 005.4 5.4 5.4 5.4 0 005.4-5.4V4.2h-2.7z"
        fill="currentColor"
        className="text-white"
      />
      <path
        d="M15.6 4.2v2.1c.9.2 1.7.7 2.3 1.4"
        stroke="#22d3ee"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ScrollCue() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="flex flex-col items-center gap-4 pb-4 pt-12 md:pt-16"
    >
      <span className="font-hero text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-600">
        Keşfetmek için kaydırın
      </span>
      <div className="relative flex h-16 w-[2px] overflow-hidden rounded-full bg-white/10">
        <span className="hero-scroll-line-inner absolute inset-x-0 top-0 h-full bg-gradient-to-b from-white via-indigo-300 to-transparent" />
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springMx = useSpring(mx, { stiffness: 160, damping: 20 });
  const springMy = useSpring(my, { stiffness: 160, damping: 20 });
  const rotateX = useTransform(springMy, [-80, 80], [12, -12]);
  const rotateY = useTransform(springMx, [-80, 80], [-14, 14]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = e.clientX - r.left - r.width / 2;
    const py = e.clientY - r.top - r.height / 2;
    mx.set(px * 0.28);
    my.set(py * 0.28);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  const orbitIcons = [
    { Icon: InstagramGlyph, delay: 0, radius: 100, duration: 22 },
    { Icon: TikTokGlyph, delay: 0.35, radius: 122, duration: 26 },
    { Icon: InstagramGlyph, delay: 0.62, radius: 82, duration: 19 },
    { Icon: TikTokGlyph, delay: 0.15, radius: 138, duration: 30 },
  ];

  const headline = [
    "Pazaryeri mantığıyla",
    "influencer operasyonunu",
    "tek panelden yönetin.",
  ];

  return (
    <section className="relative flex min-h-[100dvh] flex-col px-5 pb-8 pt-24 md:px-10 md:pt-28">
      <div className="relative z-[2] mx-auto grid w-full max-w-[1400px] flex-1 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <div className="flex flex-col justify-center">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-hero mb-8 text-[11px] font-semibold uppercase tracking-[0.4em] text-zinc-500"
          >
            Influencer • operasyon • teslimat
          </motion.p>

          <h1 className="font-hero text-[clamp(2.25rem,7vw,5rem)] font-bold leading-[0.95] tracking-tight text-white">
            {headline.map((line, i) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.09, duration: 0.65 }}
                className={`block ${i === 1 ? "mt-2 bg-gradient-to-r from-white via-indigo-200 to-violet-300 bg-clip-text text-transparent md:mt-3" : i === 2 ? "mt-2 text-zinc-400 md:mt-4" : ""}`}
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.65 }}
            className="mt-10 max-w-xl text-base leading-relaxed text-zinc-400 md:text-lg"
          >
            Buybox kazananları, güvenli teslimat ve kanıtlanmış içerik akışı — depodan
            feed&apos;e kadar ölçülebilir bir kampanya dünyası.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mt-12 flex flex-wrap items-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="#cta"
                className="font-hero inline-flex rounded-full border border-white bg-white px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-zinc-200"
              >
                Konuşalım
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="#buybox"
                className="font-hero inline-flex rounded-full border border-white/20 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-300 transition-colors hover:border-white/45 hover:text-white"
              >
                Öne çıkanlar
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Visual cluster — desktop */}
        <div className="relative hidden min-h-[440px] lg:block">
          <div className="absolute inset-0 flex items-center justify-center">
            {orbitIcons.map(({ Icon, delay, radius, duration }, i) => (
              <motion.div
                key={i}
                className="absolute flex items-center justify-center"
                style={{ width: radius * 2, height: radius * 2 }}
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration,
                  ease: "linear",
                  delay,
                }}
              >
                <motion.div
                  className="absolute left-1/2 top-0 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-zinc-950/90 shadow-[0_0_24px_rgba(99,102,241,0.2)] backdrop-blur-md"
                  style={{ marginTop: -20 }}
                  animate={{ rotate: -360 }}
                  transition={{
                    repeat: Infinity,
                    duration,
                    ease: "linear",
                    delay,
                  }}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            ref={ref}
            className="relative z-10 mx-auto flex max-w-[340px] cursor-grab justify-center active:cursor-grabbing"
            style={{ perspective: 900 }}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
          >
            <motion.div
              style={{ rotateX, rotateY }}
              animate={{ y: [0, -12, 0] }}
              transition={{
                y: {
                  repeat: Infinity,
                  duration: 5.5,
                  ease: "easeInOut",
                },
              }}
            >
              <div className="relative h-40 w-48 md:h-44 md:w-52">
                <div className="absolute -inset-10 rounded-[2rem] bg-gradient-to-br from-indigo-600/35 via-violet-600/25 to-transparent blur-3xl" />
                <div className="absolute inset-0 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-800/95 to-zinc-950 shadow-[0_40px_120px_rgba(0,0,0,0.65)]">
                  <div className="flex h-full flex-col justify-between p-5">
                    <div className="flex items-start justify-between">
                      <span className="rounded-lg bg-white/5 px-2 py-1 font-hero text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                        Express
                      </span>
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="h-1.5 w-3/4 rounded-full bg-gradient-to-r from-indigo-400/90 to-violet-500/70" />
                      <div className="h-1 w-1/2 rounded-full bg-zinc-700" />
                    </div>
                    <span className="font-mono text-[10px] text-zinc-600">TRK • BUYBOX</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <ScrollCue />

      {/* Mobile visual */}
      <div className="relative z-[2] mx-auto mt-8 flex justify-center lg:hidden">
        <div className="relative h-36 w-44 scale-[0.92]">
          <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-indigo-600/30 to-transparent blur-2xl" />
          <div className="relative h-full rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-800 to-zinc-950 p-4 shadow-2xl">
            <div className="flex h-full flex-col justify-between">
              <span className="font-hero text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                Buybox
              </span>
              <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
