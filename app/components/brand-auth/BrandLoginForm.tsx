"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { useState } from "react";

export function BrandLoginForm() {
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
    router.push("/panel/marka");
    router.refresh();
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {error ? <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p> : null}
      <div className="space-y-2">
        <label htmlFor="brand-email" className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
          Kurumsal e-posta
        </label>
        <input
          id="brand-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="ornek@marka.com"
          className="w-full rounded-xl border border-white/12 bg-black/40 px-4 py-3 text-sm text-white outline-none ring-offset-[#030014] placeholder:text-zinc-600 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/25"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="brand-password" className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
          Şifre
        </label>
        <input
          id="brand-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          placeholder="••••••••"
          className="w-full rounded-xl border border-white/12 bg-black/40 px-4 py-3 text-sm text-white outline-none ring-offset-[#030014] placeholder:text-zinc-600 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/25"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <label className="flex cursor-pointer items-center gap-2 text-zinc-400">
          <input
            type="checkbox"
            name="remember"
            className="size-4 rounded border-white/20 bg-black/50 text-indigo-600 focus:ring-indigo-500/40"
          />
          Beni hatırla
        </label>
        <button
          type="button"
          className="text-indigo-300 underline-offset-4 hover:text-white hover:underline"
        >
          Şifremi unuttum
        </button>
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="font-hero w-full rounded-full bg-white py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-zinc-200"
      >
        Giriş yap
      </motion.button>

      <p className="text-center text-sm text-zinc-500">
        Hesabınız yok mu?{" "}
        <Link
          href="/giris/marka/kayit"
          className="font-semibold text-indigo-300 underline-offset-4 hover:text-white hover:underline"
        >
          Üye ol
        </Link>
      </p>
      <p className="text-center text-xs text-zinc-600">Demo: brand@example.com / Brand12345</p>
    </form>
  );
}
