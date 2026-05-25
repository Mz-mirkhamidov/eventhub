import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Eventhub.uz — Tadbir platformasi",
  description:
    "O'zbekistondagi eng yirik tadbir platformasi. Toyxonalar, san'atkorlar va barter tizimi.",
  keywords: ["eventhub", "tadbir", "toyxona", "san'atkor", "O'zbekiston"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
