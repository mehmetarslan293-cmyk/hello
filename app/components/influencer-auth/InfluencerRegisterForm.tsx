"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

const input =
  "w-full rounded-xl border border-white/[0.18] bg-black/45 px-4 py-3 text-[15px] text-zinc-100 outline-none ring-offset-[#030014] placeholder:text-zinc-400 focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/35";

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold uppercase tracking-[0.14em] text-zinc-300">
      {children}
    </label>
  );
}

/** Influencer kayıt — tek adım, demo gönderim */
export function InfluencerRegisterForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const pass = String(fd.get("password") ?? "");
    const pass2 = String(fd.get("password2") ?? "");
    if (pass.length < 8) {
      setError("Şifre en az 8 karakter olmalıdır.");
      return;
    }
    if (pass !== pass2) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 text-center"
      >
        <p className="rounded-xl border border-emerald-400/35 bg-emerald-500/[0.12] px-4 py-6 text-[15px] leading-relaxed text-emerald-50">
          Kayıt talebiniz alındı (demo). Panele giriş yapmak için aşağıdan devam edin.
        </p>
        <Link
          href="/giris/influencer"
          className="font-hero inline-flex w-full justify-center rounded-full bg-white py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-zinc-200"
        >
          Giriş yap
        </Link>
      </motion.div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <Label htmlFor="inf-name">Ad soyad</Label>
        <input id="inf-name" name="fullName" type="text" autoComplete="name" required placeholder="Adınız Soyadınız" className={input} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="inf-reg-email">E-posta</Label>
        <input
          id="inf-reg-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="ornek@email.com"
          className={input}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="inf-phone">Telefon</Label>
        <input
          id="inf-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          placeholder="+90 5__ ___ __ __"
          className={input}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="inf-city">Şehir</Label>
        <input id="inf-city" name="city" type="text" autoComplete="address-level2" placeholder="İstanbul" className={input} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="inf-social">Sosyal medya</Label>
        <input
          id="inf-social"
          name="socialProfile"
          type="text"
          inputMode="url"
          autoComplete="off"
          placeholder="@kullaniciadi veya profil bağlantısı"
          className={input}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="inf-reg-password">Şifre</Label>
        <input
          id="inf-reg-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="En az 8 karakter"
          className={input}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="inf-password2">Şifre tekrar</Label>
        <input
          id="inf-password2"
          name="password2"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Şifrenizi tekrarlayın"
          className={input}
        />
      </div>

      {error ? (
        <p className="rounded-xl border border-red-400/40 bg-red-500/[0.12] px-4 py-3 text-center text-[15px] text-red-100">{error}</p>
      ) : null}

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="font-hero mt-2 w-full rounded-full bg-white py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-zinc-200"
      >
        Hesap oluştur
      </motion.button>

      <p className="text-center text-[15px] text-zinc-400">
        Zaten hesabınız var mı?{" "}
        <Link href="/giris/influencer" className="font-semibold text-violet-300 underline-offset-4 hover:text-white hover:underline">
          Giriş yap
        </Link>
      </p>
    </form>
  );
}
