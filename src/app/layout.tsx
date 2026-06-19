import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kk" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-bg text-fg">
        {children}
        <Toaster theme="dark" position="top-right" richColors />
      </body>
    </html>
  );
}
