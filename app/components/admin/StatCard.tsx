export function StatCard({
  title,
  value,
  hint,
  variant = "default",
}: {
  title: string;
  value: string;
  hint?: string;
  variant?: "default" | "emerald" | "amber" | "rose";
}) {
  const ring =
    variant === "emerald"
      ? "shadow-[inset_0_0_0_1px_rgba(52,211,153,0.15)]"
      : variant === "amber"
        ? "shadow-[inset_0_0_0_1px_rgba(251,191,36,0.15)]"
        : variant === "rose"
          ? "shadow-[inset_0_0_0_1px_rgba(251,113,133,0.15)]"
          : "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]";

  return (
    <div className={`rounded-2xl bg-white/[0.03] p-5 backdrop-blur-sm ${ring}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">{title}</p>
      <p className="mt-2 font-hero text-2xl font-bold tracking-tight text-white md:text-[1.65rem]">{value}</p>
      {hint ? <p className="mt-2 text-xs leading-relaxed text-zinc-500">{hint}</p> : null}
    </div>
  );
}

export function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="font-hero text-xl font-bold text-white md:text-2xl">{title}</h2>
      {subtitle ? <p className="mt-1 max-w-2xl text-sm text-zinc-400">{subtitle}</p> : null}
    </div>
  );
}

export function Badge({
  children,
  tone = "zinc",
}: {
  children: React.ReactNode;
  tone?: "zinc" | "emerald" | "amber" | "rose" | "indigo" | "violet";
}) {
  const cls =
    tone === "emerald"
      ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-200"
      : tone === "amber"
        ? "border-amber-500/30 bg-amber-500/15 text-amber-100"
        : tone === "rose"
          ? "border-rose-500/30 bg-rose-500/15 text-rose-100"
          : tone === "indigo"
            ? "border-indigo-500/30 bg-indigo-500/15 text-indigo-100"
            : tone === "violet"
              ? "border-violet-500/30 bg-violet-500/15 text-violet-100"
              : "border-white/10 bg-white/[0.05] text-zinc-300";

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${cls}`}>
      {children}
    </span>
  );
}
