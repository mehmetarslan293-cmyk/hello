"use client";

import { motion } from "framer-motion";
import { MotionReveal } from "./MotionReveal";

const steps = [
  {
    id: "marka",
    title: "Marka",
    subtitle: "Brief & ürün",
    icon: "M",
  },
  {
    id: "depo",
    title: "Depo",
    subtitle: "Kit konsolidasyon",
    icon: "D",
  },
  {
    id: "inf",
    title: "Influencer",
    subtitle: "Buybox kazanan",
    icon: "I",
  },
  {
    id: "icerik",
    title: "İçerik",
    subtitle: "Onaylı teslim",
    icon: "✓",
  },
];

export function ProcessSteps() {
  return (
    <section id="surec" className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
      <MotionReveal>
        <div className="mb-14 text-center">
          <p className="font-hero mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
            Kargo süreci
          </p>
          <h2 className="font-hero text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-tight text-white">
            Markadan içeriğe tek çizgi
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
            İnce çizgi sanatı ve akışkan çizgilerle operasyonun dört aşaması — her
            adımda izlenebilirlik.
          </p>
        </div>
      </MotionReveal>

      <div className="relative md:min-h-[220px]">
        <motion.svg
          className="pointer-events-none absolute left-0 right-0 top-8 z-0 hidden h-[200px] w-full md:block"
          viewBox="0 0 960 200"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <motion.path
            d="M80 120 C200 40 280 200 360 120 S520 40 600 120 S760 40 880 120"
            stroke="url(#lineGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="8 10"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
          />
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.35" />
            </linearGradient>
          </defs>
        </motion.svg>

        <div className="relative z-10 grid gap-10 md:grid-cols-4 md:gap-6 md:pt-0">
          {steps.map((step, i) => (
            <MotionReveal key={step.id} delay={i * 0.1}>
              <motion.div
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 0 36px rgba(139,92,246,0.25)",
                }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="relative flex flex-col items-center rounded-2xl border border-white/[0.08] bg-zinc-900/40 px-6 py-8 text-center backdrop-blur-sm"
              >
                {/* Thin circle line-art */}
                <motion.div
                  className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-indigo-400/60 bg-zinc-950/80 shadow-[inset_0_0_24px_rgba(99,102,241,0.15)]"
                  initial={{ scale: 0.85, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * i, type: "spring", stiffness: 260 }}
                >
                  <span className="font-[family-name:var(--font-display)] text-xl font-bold text-transparent bg-gradient-to-br from-indigo-300 to-violet-400 bg-clip-text">
                    {step.icon}
                  </span>
                  <motion.svg
                    className="pointer-events-none absolute inset-0"
                    viewBox="0 0 64 64"
                    aria-hidden
                  >
                    <defs>
                      <linearGradient
                        id={`ring-${step.id}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#c084fc" />
                      </linearGradient>
                    </defs>
                    <motion.circle
                      cx="32"
                      cy="32"
                      r="29"
                      fill="none"
                      stroke={`url(#ring-${step.id})`}
                      strokeWidth="1"
                      strokeDasharray="4 6"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.15 + i * 0.08 }}
                    />
                  </motion.svg>
                </motion.div>
                <h3 className="font-hero text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-500">{step.subtitle}</p>

                {i < steps.length - 1 && (
                  <div className="my-4 flex justify-center md:hidden" aria-hidden>
                    <svg width="2" height="40" className="text-indigo-500/40">
                      <line
                        x1="1"
                        y1="0"
                        x2="1"
                        y2="40"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="4 6"
                      />
                    </svg>
                  </div>
                )}
              </motion.div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
