import type { Metadata } from "next";
import "./globals.css";
import Providers from "./component/providers"; // client wrapper
import { EB_Garamond } from "next/font/google"; // ⬅️ Import font

// Load EB Garamond from Google Fonts
const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BibleMind",
  description: "Daily Vatican Readings & Reflections",
  manifest: "/manifest.json",
  themeColor: "#8B0000",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Apply font + bigger size */}
      <body className={`${garamond.className} text-lg leading-relaxed`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
