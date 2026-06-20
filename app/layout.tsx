import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Qadam — Болашағыңа бүгіннен бастап қадам жаса",
    template: "%s | Qadam",
  },
  description:
    "Qadam — мақсат қою, қаржылық сауаттылық, жинақтар, инвестициялар және жеке даму платформасы. Болашағыңа бүгіннен бастап қадам жаса.",
  keywords: [
    "qadam",
    "қаржылық сауаттылық",
    "мақсат",
    "жинақ",
    "инвестиция",
    "жеке даму",
    "казахстан",
  ],
  authors: [{ name: "Qadam" }],
  creator: "Qadam",
  openGraph: {
    type: "website",
    locale: "kk_KZ",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: "Qadam — Болашағыңа бүгіннен бастап қадам жаса",
    description: "Мақсат қою, қаржылық сауаттылық және жеке даму платформасы",
    siteName: "Qadam",
  },
  twitter: {
    card: "summary_large_image",
    title: "Qadam",
    description: "Болашағыңа бүгіннен бастап қадам жаса",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#080810" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="kk"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
