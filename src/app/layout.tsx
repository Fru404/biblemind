import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
