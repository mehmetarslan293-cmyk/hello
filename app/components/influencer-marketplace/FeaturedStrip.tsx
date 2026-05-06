"use client";

import { motion } from "framer-motion";
import { MotionReveal } from "./MotionReveal";
import {
  IllBuyboxPool,
  IllDashboard,
  IllRealtimeTracking,
  IllSecurePayment,
} from "./FeaturedStripIllustrations";

type IllustrationComponent = React.ComponentType<{ className?: string }>;

type FeaturedCard = {
  id?: string;
  tag: string;
  title: string;
  desc: string;
  accent: string;
  tall?: boolean;
  isBuybox?: boolean;
  Illustration?: IllustrationComponent;
};

const CARDS: FeaturedCard[] = [
  {
    id: "buybox",
    tag: "buybox • performans • seçim",
    title: "Buybox Winner",
    desc: "Önerilen influencer kartı — rozetler ve SLA ile tek bakışta güven.",
    accent: "from-indigo-600/50 via-violet-600/30 to-transparent",
    tall: true,
    isBuybox: true,
  },
  {
    tag: "sıralama • skor",
    title: "Buybox havuzu",
    desc: "Teklifler tek yerde; performans ve teslim süresine göre otomatik sıralama.",
    accent: "from-violet-600/40 via-fuchsia-700/20 to-transparent",
    Illustration: IllBuyboxPool,
  },
  {
    tag: "kargo • teslim",
    title: "Gerçek zamanlı takip",
    desc: "Paket ve onay akışı — görevler yeşil tik ile kapanır.",
    accent: "from-emerald-600/35 via-teal-900/20 to-transparent",
    Illustration: IllRealtimeTracking,
  },
  {
    tag: "ödeme • güven",
    title: "Emanet ödeme",
    desc: "İçerik onayından önce bakiye güvende — PCI hazır altyapı.",
    accent: "from-indigo-500/35 via-zinc-900/40 to-transparent",
    Illustration: IllSecurePayment,
  },
  {
    tag: "analitik • rapor",
    title: "Dashboard",
    desc: "ER, reach ve export — Slack ile bildirim.",
    accent: "from-fuchsia-600/30 via-indigo-950/50 to-transparent",
    Illustration: IllDashboard,
  },
];

/** Yan yana kart şeridi — yatay kaydırma (scrollbar gizli). */
export function FeaturedStrip() {
  return (
    <section className="relative overflow-x-hidden py-16 md:py-24">
      <MotionReveal>
        <div className="mx-auto mb-10 max-w-[1400px] px-5 md:mb-14 md:px-10">
          <p className="font-hero mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
            Öne çıkanlar
          </p>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="font-hero max-w-3xl text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight tracking-tight text-white">
              Önde gelen markalar için kampanya ve teslim deneyimleri.
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-zinc-500 lg:text-right">
              Kartları yatay kaydırarak tüm modülleri yan yana gezin.
            </p>
          </div>
        </div>
      </MotionReveal>

      <div className="relative">
        <div className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 pl-5 pr-5 md:gap-8 md:pl-10 md:pr-10">
          {CARDS.map((c, i) => {
            const Illustration = c.Illustration;
            return (
            <motion.article
              key={c.title}
              id={c.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ delay: i * 0.05, duration: 0.45 }}
              whileHover={{
                scale: 1.015,
                boxShadow: "0 0 40px rgba(99,102,241,0.18)",
              }}
              className={`relative shrink-0 snap-start overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#09090b] shadow-[0_24px_70px_rgba(0,0,0,0.45)] ${
                c.tall
                  ? "min-h-[min(72svh,600px)] w-[min(88vw,520px)] lg:w-[min(480px,42vw)]"
                  : "min-h-[min(68svh,560px)] w-[min(85vw,420px)] lg:w-[min(400px,34vw)]"
              }`}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${c.accent} opacity-55`}
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.06)_0%,_transparent_55%)]" />

              <div className="relative flex h-full flex-col justify-between p-8 md:p-10">
                <div>
                  <p className="font-hero text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
                    {c.tag}
                  </p>
                  <h3 className="font-hero mt-5 text-xl font-bold tracking-tight text-white md:text-2xl lg:text-3xl">
                    {c.title}
                  </h3>
                  <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-zinc-400">
                    {c.desc}
                  </p>
                </div>

                <div className="mt-10 md:mt-12">
                  {c.isBuybox ? (
                    <BuyboxMini />
                  ) : Illustration ? (
                    <Illustration className="h-auto w-full max-h-[240px] object-contain opacity-95 md:max-h-[260px]" />
                  ) : null}
                </div>
              </div>
            </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BuyboxMini() {
  return (
    <div className="relative mx-auto max-w-sm rounded-2xl border border-white/10 bg-black/35 p-6 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <div className="shimmer-bar absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-60" />
      </div>
      <div className="relative flex items-center gap-5">
        <div className="relative h-16 w-16 shrink-0">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 opacity-80 blur-lg" />
          <div className="relative flex h-full w-full items-center justify-center rounded-xl border border-white/15 bg-zinc-900 font-hero text-xl font-bold text-white">
            AY
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="truncate font-hero text-lg font-semibold text-white">
            Ayşe K.{" "}
            <span className="font-normal text-zinc-500">@aylifecreator</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {["Yüksek performans", "Hızlı kargo"].map((b) => (
              <span
                key={b}
                className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-200"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
