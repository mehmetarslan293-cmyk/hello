"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MotionReveal } from "./MotionReveal";

export function ApproachSection() {
  return (
    <section
      id="yaklasim"
      className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32 lg:py-40"
    >
      <div className="grid gap-16 lg:grid-cols-2 lg:items-end lg:gap-24">
        <MotionReveal>
          <p className="font-hero mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
            Cesur fikirler, hayata geçer
          </p>
          <h2 className="font-hero text-[clamp(2rem,5vw,3.75rem)] font-bold leading-[1.05] tracking-tight text-white">
            Tasarım, hareket ve operasyonu bir araya getiriyoruz — kampanyadan teslimata
            kadar akıcı bir deneyim.
          </h2>
        </MotionReveal>
        <MotionReveal delay={0.08}>
          <div className="space-y-8 lg:pb-2">
            <p className="text-lg leading-relaxed text-zinc-400 md:text-xl">
              Taklit etmiyoruz; markanıza özel, ölçülebilir influencer akışları kuruyoruz.
              Buybox ile öne çıkanları seçiyor, güvenli ödeme ve kargo ile teslimatı
              kapatıyoruz.
            </p>
            <motion.div
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
              <Link
                href="#surec"
                className="inline-flex items-center gap-3 font-hero text-sm font-semibold uppercase tracking-[0.2em] text-white"
              >
                Yaklaşımımız
                <span
                  className="inline-block h-px w-12 bg-gradient-to-r from-white to-transparent"
                  aria-hidden
                />
              </Link>
            </motion.div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
