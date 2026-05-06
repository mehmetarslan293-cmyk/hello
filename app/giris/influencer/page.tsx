import type { Metadata } from "next";
import { BrandAuthShell } from "@/app/components/brand-auth/BrandAuthShell";
import { InfluencerLoginForm } from "@/app/components/influencer-auth/InfluencerLoginForm";

export const metadata: Metadata = {
  title: "Influencer girişi | HelloBubble",
  description: "Influencer hesabınızla giriş yapın.",
};

export default function InfluencerGirisPage() {
  return (
    <BrandAuthShell
      eyebrow="Influencer"
      title="Giriş yap"
      subtitle="İçerik üretici hesabınızla kampanya ve tekliflerinize erişin."
    >
      <InfluencerLoginForm />
    </BrandAuthShell>
  );
}
