import Link from "next/link";
import type { ReactNode } from "react";
import { HelloBubbleLogo } from "@/app/components/HelloBubbleLogo";

export function BrandAuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[#030014] px-4 pb-16 pt-28 md:px-8 md:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.12)_0%,_transparent_55%)]" />
      <div className="relative mx-auto w-full max-w-[460px]">
        <div className="mb-6">
          <HelloBubbleLogo textClassName="text-white" />
        </div>
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.14em] text-zinc-500 transition-colors hover:text-white"
        >
          <span aria-hidden>←</span> Ana sayfa
        </Link>

        <p className="font-hero text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-400/90">
          {eyebrow}
        </p>
        <h1 className="font-hero mt-3 text-3xl font-bold tracking-tight text-white md:text-[2rem]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{subtitle}</p>
        ) : null}

        <div className="mt-10 rounded-[1.5rem] border border-white/[0.08] bg-white/[0.03] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-10">
          {children}
        </div>

        {footer ? <div className="mt-8 text-center text-sm text-zinc-500">{footer}</div> : null}
      </div>
    </div>
  );
}
