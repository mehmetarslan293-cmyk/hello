"use client";

import { motion } from "framer-motion";

function burst() {
  void import("canvas-confetti").then(({ default: confetti }) => {
    confetti({
      particleCount: 55,
      spread: 60,
      origin: { y: 0.65 },
      colors: ["#ffffff", "#a78bfa", "#6366f1"],
    });
  });
}

export function CTASection() {
  return (
    <section
      id="cta"
      className="relative mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40"
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-zinc-950 via-black to-indigo-950/60 px-8 py-20 text-center md:px-16 md:py-28">
        <div className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-indigo-600/25 blur-[100px]" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-violet-600/20 blur-[90px]" />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-hero text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500"
        >
          Hazır mısınız?
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.06 }}
          className="font-hero mx-auto mt-6 max-w-4xl text-[clamp(2rem,6vw,4rem)] font-bold leading-[1.05] tracking-tight text-white"
        >
          Büyük fikriniz
          <br />
          sahneye çıkmayı bekliyor.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
          className="mx-auto mt-6 max-w-xl text-lg text-zinc-400"
        >
          Birlikte tanımlayalım: kampanya akışı, buybox kuralları ve teslim SLA&apos;ları.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.18 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.button
            type="button"
            onClick={burst}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="font-hero rounded-full border border-white bg-white px-10 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-black"
          >
            Erken erişim iste
          </motion.button>
          <a
            href="#yaklasim"
            className="font-hero rounded-full border border-white/20 px-10 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300 transition-colors hover:border-white/40 hover:text-white"
          >
            Yaklaşıma dön
          </a>
        </motion.div>
      </div>
    </section>
  );
}
