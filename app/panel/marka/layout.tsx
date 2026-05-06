import type { Metadata } from "next";
import { AuthSessionProvider } from "@/app/components/AuthSessionProvider";
import { BrandPanelHeader } from "@/app/components/brand-panel/BrandPanelHeader";
import { BrandPanelSidebar } from "@/app/components/brand-panel/BrandPanelSidebar";

export const metadata: Metadata = {
  title: "Marka paneli | HelloBubble",
  description: "Kampanya, influencer keşfi ve performans tek yerde.",
};

export default function MarkaPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionProvider>
      <div className="flex min-h-screen bg-[#eef0f4]">
        <BrandPanelSidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <BrandPanelHeader />
          <div className="flex-1 px-4 pb-10 pt-6 md:px-8">{children}</div>
        </div>
      </div>
    </AuthSessionProvider>
  );
}
