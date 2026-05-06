import type { Metadata } from "next";
import { BrandAuthShell } from "@/app/components/brand-auth/BrandAuthShell";
import { BrandLoginForm } from "@/app/components/brand-auth/BrandLoginForm";

export const metadata: Metadata = {
  title: "Marka girişi | HelloBubble",
  description: "Marka hesabınızla giriş yapın.",
};

export default function MarkaGirisPage() {
  return (
    <BrandAuthShell
      eyebrow="Marka"
      title="Giriş yap"
      subtitle="Kurumsal hesabınızla panele erişin."
    >
      <BrandLoginForm />
    </BrandAuthShell>
  );
}
