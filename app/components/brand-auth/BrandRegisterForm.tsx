"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const STEPS = 3;

const COUNTRIES = [
  "Türkiye",
  "Almanya",
  "Amerika Birleşik Devletleri",
  "Birleşik Krallık",
  "Fransa",
  "Hollanda",
  "İspanya",
  "İtalya",
  "Suudi Arabistan",
  "Birleşik Arap Emirlikleri",
  "Diğer",
];

const COMPANY_TYPES = [
  "Şahıs işletmesi",
  "Limited şirket (Ltd.)",
  "Anonim şirket (A.Ş.)",
  "Komandit / kolektif",
  "Kooperatif",
  "Yurt dışı tüzel kişilik",
  "Diğer",
];

const SECTORS = [
  "Moda & aksesuar",
  "Kozmetik & kişisel bakım",
  "Gıda & içecek",
  "Teknoloji & yazılım",
  "Sağlık & ilaç",
  "Finans & sigorta",
  "Otomotiv",
  "Eğitim",
  "Turizm & otelcilik",
  "Diğer",
];

const REFERRAL_SOURCES = [
  "Google araması",
  "Instagram",
  "TikTok",
  "LinkedIn",
  "YouTube",
  "Arkadaş / iş ortağı tavsiyesi",
  "Basın / blog yazısı",
  "Etkinlik / fuar",
  "Diğer",
];

type FormState = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  country: string;
  brandName: string;
  website: string;
  companyType: string;
  sector: string;
  referral: string;
  password: string;
  password2: string;
};

const INITIAL: FormState = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
  country: "",
  brandName: "",
  website: "",
  companyType: "",
  sector: "",
  referral: "",
  password: "",
  password2: "",
};

/** Koyu tema — daha yüksek kontrast (placeholder / kenar) */
const inputClass =
  "w-full rounded-full border border-white/[0.18] bg-black/45 px-5 py-3.5 text-[15px] leading-snug text-zinc-100 outline-none ring-offset-[#030014] transition-[box-shadow,border-color,background-color] placeholder:text-zinc-400 focus:border-pink-400/70 focus:ring-2 focus:ring-pink-500/35";

const selectClass =
  "w-full appearance-none rounded-full border border-white/[0.18] bg-black/45 px-5 py-3.5 text-[15px] leading-snug text-zinc-100 outline-none ring-offset-[#030014] transition-[box-shadow,border-color] focus:border-pink-400/70 focus:ring-2 focus:ring-pink-500/35";

const gradientPrimary =
  "rounded-full bg-gradient-to-r from-[#FF8C42] via-[#ff5ca8] to-[#FF0080] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_32px_-8px_rgba(236,72,153,0.65)] drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)] transition hover:brightness-[1.05] active:brightness-[0.98]";

/** Koyu tema, 3 adım — sitenin marka auth paleti (#030014, cam yüzey, marka gradient) */
export function BrandRegisterForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormState>(INITIAL);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setData((d) => ({ ...d, [key]: value }));
    setError(null);
  }

  function fail(msg: string) {
    setError(msg);
    return false;
  }

  function validateStep(s: number): boolean {
    if (s === 1) {
      if (!data.fullName.trim()) return fail("İsim soyisim zorunludur.");
      if (!data.title.trim()) return fail("Ünvan zorunludur.");
      if (!data.email.trim() || !data.email.includes("@"))
        return fail("Geçerli bir e-posta girin.");
      if (!data.phone.trim()) return fail("Telefon numarası zorunludur.");
      if (!data.country) return fail("Ülke seçin.");
      return true;
    }
    if (s === 2) {
      if (!data.brandName.trim()) return fail("Marka adı zorunludur.");
      if (!data.companyType) return fail("Şirket türü seçin.");
      if (!data.sector) return fail("Sektör seçin.");
      if (!data.referral) return fail("Kaynak seçin.");
      return true;
    }
    return true;
  }

  function next() {
    if (!validateStep(step)) return;
    setStep((v) => Math.min(STEPS, v + 1));
  }

  function back() {
    setError(null);
    setStep((v) => Math.max(1, v - 1));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2)) return;
    if (data.password.length < 8) return fail("Şifre en az 8 karakter olmalı.");
    if (data.password !== data.password2) return fail("Şifreler eşleşmiyor.");
    setSent(true);
  }

  return (
    <div className="relative mx-auto w-full max-w-lg px-4 py-10 md:py-14">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.14em] text-zinc-400 transition-colors hover:text-white"
      >
        <span aria-hidden>←</span> Ana sayfa
      </Link>

      <header className="mb-8 text-center">
        <h1 className="font-hero text-2xl font-bold tracking-tight text-white md:text-[1.65rem]">
          🚀 Marka Hesabınızı Oluşturun
        </h1>
        <p className="mt-3 text-base leading-relaxed text-zinc-300 md:text-[15px]">
          Hemen kayıt olun ve iş birliği fırsatlarını keşfetmeye başlayın!
        </p>
        <p className="mt-4 text-lg opacity-90" aria-hidden>
          ⭐
        </p>

        <div className="mx-auto mt-8 flex max-w-[280px] gap-2 md:max-w-xs" aria-hidden>
          {[1, 2, 3].map((i) => {
            const active = step === i;
            const done = step > i;
            return (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-r from-[#FF8C42] to-[#FF0080] shadow-[0_0_16px_rgba(255,0,128,0.45)]"
                    : done
                      ? "bg-gradient-to-r from-orange-500/45 to-pink-500/45"
                      : "bg-white/[0.1]"
                }`}
              />
            );
          })}
        </div>
        <p className="sr-only">
          Adım {step} / {STEPS}
        </p>
      </header>

      <form
        lang="tr"
        className="rounded-[2rem] border border-white/[0.08] bg-white/[0.04] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:rounded-[2.25rem] md:p-10"
        onSubmit={submit}
      >
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="ok"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-emerald-400/35 bg-emerald-500/[0.12] px-4 py-6 text-center text-[15px] leading-relaxed text-emerald-50"
            >
              Hesap oluşturma talebiniz alındı (demo).
              <div className="mt-6">
                <Link href="/giris/marka" className={`inline-flex no-underline ${gradientPrimary}`}>
                  Giriş yap
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 md:space-y-5"
            >
              {step === 1 && (
                <>
                  <Field label="İsim soyisim">
                    <input
                      className={inputClass}
                      placeholder="İsim soyisim"
                      value={data.fullName}
                      onChange={(e) => patch("fullName", e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </Field>
                  <Field label="Ünvan">
                    <input
                      className={inputClass}
                      placeholder="Ünvanınız"
                      value={data.title}
                      onChange={(e) => patch("title", e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="E-posta">
                    <input
                      type="email"
                      className={inputClass}
                      placeholder="mail@kurumsal.com"
                      value={data.email}
                      onChange={(e) => patch("email", e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </Field>
                  <Field label="Telefon">
                    <input
                      type="tel"
                      className={inputClass}
                      placeholder="+90 5__ ___ __ __"
                      value={data.phone}
                      onChange={(e) => patch("phone", e.target.value)}
                      autoComplete="tel"
                      required
                    />
                  </Field>
                  <Field label="Ülke">
                    <select
                      className={selectClass}
                      value={data.country}
                      onChange={(e) => patch("country", e.target.value)}
                      required
                    >
                      <option value="">Ülke seçin</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                </>
              )}

              {step === 2 && (
                <>
                  <Field label="Marka adı">
                    <input
                      className={inputClass}
                      placeholder="Marka Adı"
                      value={data.brandName}
                      onChange={(e) => patch("brandName", e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="Web sitesi">
                    <input
                      type="url"
                      className={inputClass}
                      placeholder="Web Sitesi"
                      value={data.website}
                      onChange={(e) => patch("website", e.target.value)}
                    />
                  </Field>
                  <Field label="Şirket türü">
                    <div className="relative">
                      <select
                        className={`${selectClass} pr-10`}
                        value={data.companyType}
                        onChange={(e) => patch("companyType", e.target.value)}
                        required
                      >
                        <option value="">Şirket Türü</option>
                        {COMPANY_TYPES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <Chevron className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    </div>
                  </Field>
                  <Field label="Sektör">
                    <div className="relative">
                      <select
                        className={`${selectClass} pr-10`}
                        value={data.sector}
                        onChange={(e) => patch("sector", e.target.value)}
                        required
                      >
                        <option value="">Sektör</option>
                        {SECTORS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <Chevron className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    </div>
                  </Field>
                  <Field label="Kaynak">
                    <div className="relative">
                      <select
                        className={`${selectClass} pr-10`}
                        value={data.referral}
                        onChange={(e) => patch("referral", e.target.value)}
                        required
                      >
                        <option value="">Bizi nereden duydunuz?</option>
                        {REFERRAL_SOURCES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <Chevron className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    </div>
                  </Field>
                </>
              )}

              {step === 3 && (
                <>
                  <Field label="Şifre">
                    <input
                      type="password"
                      className={inputClass}
                      placeholder="En az 8 karakter"
                      value={data.password}
                      onChange={(e) => patch("password", e.target.value)}
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                  </Field>
                  <Field label="Şifre tekrar">
                    <input
                      type="password"
                      className={inputClass}
                      placeholder="Şifrenizi tekrarlayın"
                      value={data.password2}
                      onChange={(e) => patch("password2", e.target.value)}
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                  </Field>
                </>
              )}

              {error ? (
                <p className="rounded-2xl border border-red-400/40 bg-red-500/[0.12] px-4 py-3 text-center text-[15px] leading-snug text-red-100">{error}</p>
              ) : null}

              <div className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 1}
                  className="rounded-full border border-white/35 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-zinc-200 shadow-sm transition hover:enabled:border-pink-400/60 hover:enabled:bg-white/[0.07] hover:enabled:text-white disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-transparent disabled:text-zinc-400 disabled:shadow-none"
                >
                  Önceki Adım
                </button>
                {step < STEPS ? (
                  <button type="button" onClick={next} className={gradientPrimary}>
                    Sonraki Adım
                  </button>
                ) : (
                  <button type="submit" className={gradientPrimary}>
                    Hesabını Oluştur
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {!sent ? (
        <p className="mt-10 text-center text-[15px] leading-relaxed text-zinc-400">
          Marka hesabınız mevcut mu?{" "}
          <Link
            href="/giris/marka"
            className="font-semibold text-pink-400 underline-offset-[3px] hover:text-pink-300 hover:underline"
          >
            Giriş Yap
          </Link>
        </p>
      ) : null}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block cursor-pointer space-y-2.5 text-left">
      <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-300">{label}</span>
      {children}
    </label>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
