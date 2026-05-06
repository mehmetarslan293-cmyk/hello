"use client";

import { motion } from "framer-motion";
import { MotionReveal } from "./MotionReveal";
import { LottieDelivery } from "./LottieDelivery";

function burst() {
  void import("canvas-confetti").then(({ default: confetti }) => {
    confetti({
      particleCount: 45,
      spread: 55,
      origin: { y: 0.65 },
      colors: ["#6366f1", "#8b5cf6", "#34d399"],
    });
  });
}

export function BentoFeatures() {
  return (
    <section id="ozellikler" className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
      <MotionReveal>
        <div className="mb-14 max-w-3xl">
          <p className="font-hero mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
            Platform
          </p>
          <h2 className="font-hero text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-tight text-white">
            Tek yerden güç
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-400">
            Modüler kutular — özellikleri tek bakışta tarayın; öncelik tamamen sizde.
          </p>
        </div>
      </MotionReveal>

      <div className="grid auto-rows-[minmax(140px,auto)] grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
        <MotionReveal className="md:col-span-7 md:row-span-2">
          <motion.div
            whileHover={{
              scale: 1.015,
              boxShadow: "0 0 48px rgba(99,102,241,0.2)",
            }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="flex h-full min-h-[280px] flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-indigo-950/80 via-zinc-950 to-zinc-950 p-8 shadow-xl"
          >
            <div>
              <h3 className="font-hero text-2xl font-bold text-white">
                Buybox & sıralama
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
                Teklifler tek havuzda; performans, teslim süresi ve güven skoruyla
                otomatik sıralama. Kazanan kartınız tek tıkla işbirliğine döner.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Skor", "SLA", "Onay"].map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </MotionReveal>

        <MotionReveal delay={0.05} className="md:col-span-5">
          <motion.div
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 40px rgba(52,211,153,0.15)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="flex h-full flex-col justify-between rounded-3xl border border-emerald-500/20 bg-emerald-950/20 p-6"
          >
            <div>
              <h3 className="font-hero text-lg font-bold text-white">
                Kargo takibi
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Paket durumu ve teslim onayı gerçek zamanlı — yeşil tik ile kapanan
                görevler.
              </p>
            </div>
            <LottieDelivery />
          </motion.div>
        </MotionReveal>

        <MotionReveal delay={0.08} className="md:col-span-5">
          <motion.div
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 36px rgba(129,140,248,0.2)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="flex h-full flex-col rounded-3xl border border-white/[0.07] bg-zinc-900/50 p-6 backdrop-blur-md"
          >
            <h3 className="font-hero text-lg font-bold text-white">
              Güvenli ödeme
            </h3>
            <p className="mt-2 flex-1 text-sm text-zinc-400">
              Emanet ödeme akışı; içerik onaylanana kadar bakiye güvende.
            </p>
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/30 text-lg">
                🔒
              </span>
              <div className="text-xs text-zinc-500">
                <p className="font-semibold text-zinc-300">PCI uyumlu altyapı</p>
                <p>3D doğrulama hazır</p>
              </div>
            </div>
          </motion.div>
        </MotionReveal>

        <MotionReveal delay={0.1} className="md:col-span-12">
          <motion.div
            whileHover={{
              scale: 1.01,
              boxShadow: "0 0 44px rgba(167,139,250,0.18)",
            }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="grid gap-6 rounded-3xl border border-violet-500/25 bg-gradient-to-r from-violet-950/40 via-zinc-950 to-indigo-950/40 p-8 md:grid-cols-2 md:items-center"
          >
            <div>
              <h3 className="font-hero text-xl font-bold text-white">
                Analitik & rapor
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                ER, reach ve dönüşüm tek dashboard&apos;da; CSV ve Slack bildirimleri.
              </p>
              <motion.a
                href="#cta"
                onClick={burst}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
                className="font-hero mt-6 inline-flex rounded-full border border-white/20 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_0_32px_rgba(99,102,241,0.2)] transition-colors hover:border-white/45"
              >
                Erken erişim iste
              </motion.a>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              {[
                { label: "Gerçek zamanlı", v: "Live" },
                { label: "Entegrasyon", v: "API" },
                { label: "Export", v: "CSV" },
              ].map((x) => (
                <div
                  key={x.label}
                  className="min-w-[120px] rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-center"
                >
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    {x.label}
                  </p>
                  <p className="font-hero text-lg font-bold text-white">
                    {x.v}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </MotionReveal>
      </div>
    </section>
  );
}
