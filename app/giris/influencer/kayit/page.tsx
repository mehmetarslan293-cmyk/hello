import type { Metadata } from "next";
import { BrandAuthShell } from "@/app/components/brand-auth/BrandAuthShell";
import { InfluencerRegisterForm } from "@/app/components/influencer-auth/InfluencerRegisterForm";

export const metadata: Metadata = {
  title: "Influencer üyeliği | HelloBubble",
  description: "Influencer olarak kayıt olun — profilinizi tamamlayın.",
};

export default function InfluencerKayitPage() {
  return (
    <BrandAuthShell
      eyebrow="Influencer"
      title="Üye ol"
      subtitle="Temel bilgilerinizi girin; uygun kampanyaları keşfetmeye başlayın."
      footer={
        <>
          Sorularınız için <span className="text-zinc-400">destek@ornek.com</span>
        </>
      }
    >
      <InfluencerRegisterForm />
    </BrandAuthShell>
  );
}
