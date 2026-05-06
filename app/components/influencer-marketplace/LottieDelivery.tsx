"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(
  () => import("lottie-react").then((mod) => mod.default),
  { ssr: false },
);

export function LottieDelivery() {
  const [data, setData] = useState<object | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch("/lottie/delivery.json")
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    return (
      <div
        className="mx-auto flex h-52 max-w-xs items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/40"
        aria-hidden
      >
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xs drop-shadow-[0_0_40px_rgba(139,92,246,0.35)]">
      <Lottie animationData={data} loop className="h-52 w-full" />
    </div>
  );
}
