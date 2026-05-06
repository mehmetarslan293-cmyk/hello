import type { Metadata } from "next";
import { BrandRegisterForm } from "@/app/components/brand-auth/BrandRegisterForm";

export const metadata: Metadata = {
  title: "Marka üyeliği | HelloBubble",
  description: "Marka olarak kayıt olun — iletişim ve firma bilgilerinizi tamamlayın.",
};

export default function MarkaKayitPage() {
  return (
    <div className="relative min-h-screen bg-[#030014] pb-16 pt-24 md:pb-20 md:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.12)_0%,_transparent_55%)]" />
      <div className="relative">
        <BrandRegisterForm />
        <p className="pb-10 text-center text-[15px] text-zinc-400">
          Sorularınız için{" "}
          <span className="font-medium text-zinc-300">is@ornek.com</span>
        </p>
      </div>
    </div>
  );
}
