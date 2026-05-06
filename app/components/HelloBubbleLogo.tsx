import Link from "next/link";

type HelloBubbleLogoProps = {
  href?: string;
  className?: string;
  textClassName?: string;
  compact?: boolean;
};

export function HelloBubbleLogo({
  href = "/",
  className = "",
  textClassName = "",
  compact = false,
}: HelloBubbleLogoProps) {
  const content = (
    <span className={`inline-flex items-center gap-3 ${className}`.trim()}>
      <span className="relative inline-flex h-10 w-10 items-center justify-center">
        <span className="absolute h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 opacity-90 shadow-[0_0_24px_rgba(129,84,255,0.45)]" />
        <span className="absolute left-1 top-1 h-2.5 w-2.5 rounded-full bg-white/85" />
        <span className="absolute right-1.5 top-2.5 h-1.5 w-1.5 rounded-full bg-white/75" />
        <span className="relative h-5 w-5 rounded-full border border-white/70 bg-white/20 backdrop-blur-sm" />
      </span>
      {!compact ? (
        <span className={`font-hero text-sm font-bold uppercase tracking-[0.14em] ${textClassName}`.trim()}>
          HelloBubble
        </span>
      ) : null}
    </span>
  );

  return (
    <Link href={href} aria-label="HelloBubble ana sayfa">
      {content}
    </Link>
  );
}
