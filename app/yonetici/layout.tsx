import type { Metadata } from "next";
import { AdminSidebar } from "@/app/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Yönetici paneli | HelloBubble",
  description: "Platform özeti, marka bakiyeleri, kampanyalar ve operasyon.",
};

export default function YoneticiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <main className="flex-1 px-5 pb-28 pt-8 md:px-10 md:pb-12 md:pt-10">{children}</main>
        <footer className="border-t border-white/[0.06] px-5 py-4 text-center text-[11px] leading-relaxed text-zinc-600 md:px-10">
          Gösterilen rakamlar demo verisidir. Üretim ortamında kimlik doğrulama, rol kontrolü ve gerçek zamanlı API bağlantısı kullanın.
        </footer>
      </div>
    </div>
  );
}
