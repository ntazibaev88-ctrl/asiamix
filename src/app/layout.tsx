import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { themeScript } from "@/lib/theme";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "CodeOrda — Бағдарламалауды қазақша үйрен", template: "%s | CodeOrda" },
  description: "Қазақстанның IT мамандарын дайындайтын платформа. HTML, CSS, JavaScript курстарын қазақ тілінде оқыңыз.",
  keywords: ["бағдарламалау", "курс", "қазақша", "HTML", "CSS", "JavaScript", "CodeOrda"],
  authors: [{ name: "CodeOrda" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "CodeOrda — Бағдарламалауды қазақша үйрен",
    description: "Қазақстанның IT мамандарын дайындайтын платформа",
    type: "website",
    locale: "kk_KZ",
    siteName: "CodeOrda",
  },
  twitter: { card: "summary_large_image", title: "CodeOrda", description: "Бағдарламалауды қазақша үйрен" },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kk" suppressHydrationWarning className={inter.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
        {children}
        <Toaster theme="system" position="top-right" richColors />
      </body>
    </html>
  );
}
