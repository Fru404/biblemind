import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Biblemind",
  description: "Companion app for christian religious life",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
