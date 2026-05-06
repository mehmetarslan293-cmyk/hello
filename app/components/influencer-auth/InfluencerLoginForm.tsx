"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { useState } from "react";

const input =
  "w-full rounded-xl border border-white/[0.18] bg-black/45 px-4 py-3 text-[15px] text-zinc-100 outline-none ring-offset-[#030014] placeholder:text-zinc-400 focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/35";

export function InfluencerLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError("Gecersiz e-posta veya sifre.");
      return;
    }
    router.push("/panel/influencer");
    router.refresh();
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {error ? <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p> : null}
      <div className="space-y-2">
        <label htmlFor="inf-email" className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-300">
          E-posta
        </label>
        <input id="inf-email" name="email" type="email" autoComplete="email" required placeholder="ornek@email.com" className={input} />
      </div>

      <div className="space-y-2">
        <label htmlFor="inf-password" className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-300">
          Sifre
        </label>
        <input id="inf-password" name="password" type="password" autoComplete="current-password" required minLength={8} placeholder="********" className={input} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <label className="flex cursor-pointer items-center gap-2 text-zinc-400">
          <input type="checkbox" name="remember" className="size-4 rounded border-white/20 bg-black/50 text-violet-600 focus:ring-violet-500/40" />
          Beni hatirla
        </label>
        <button type="button" className="text-violet-300 underline-offset-4 hover:text-white hover:underline">
          Sifremi unuttum
        </button>
      </div>

      <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="font-hero w-full rounded-full bg-white py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-zinc-200">
        Giris yap
      </motion.button>

      <p className="text-center text-[15px] text-zinc-400">
        Hesabiniz yok mu?{" "}
        <Link href="/giris/influencer/kayit" className="font-semibold text-violet-300 underline-offset-4 hover:text-white hover:underline">
          Uye ol
        </Link>
      </p>
      <p className="text-center text-xs text-zinc-600">Demo: influencer@example.com / Influencer12345</p>
    </form>
  );
}
