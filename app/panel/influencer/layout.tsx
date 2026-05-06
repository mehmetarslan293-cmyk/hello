import type { Metadata } from "next";
import { AuthSessionProvider } from "@/app/components/AuthSessionProvider";
import { InfluencerPanelHeader } from "@/app/components/influencer-panel/InfluencerPanelHeader";
import { InfluencerPanelSidebar } from "@/app/components/influencer-panel/InfluencerPanelSidebar";

export const metadata: Metadata = {
  title: "Influencer Paneli | HelloBubble",
  description: "Mobil uyumlu influencer paneli.",
};

export default function InfluencerPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionProvider>
      <div className="flex min-h-screen bg-[#f2f4f8]">
        <InfluencerPanelSidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <InfluencerPanelHeader />
          <main className="flex-1 px-3 pb-24 pt-4 md:px-8 md:pb-10">{children}</main>
        </div>
      </div>
    </AuthSessionProvider>
  );
}
