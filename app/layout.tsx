import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans, Syne } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-hero",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hellobubble.com.tr"),
  title: {
    default: "HelloBubble | Influencer Operasyon Platformu",
    template: "%s | HelloBubble",
  },
  description:
    "Markalar için buybox mantığıyla influencer operasyonu: güvenli ödeme, kargo takibi ve içerik teslimi.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${jakarta.variable} ${dmSans.variable} ${syne.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full overflow-x-hidden bg-[#030014] text-[#f4f4f8]">
        {children}
      </body>
    </html>
  );
}
