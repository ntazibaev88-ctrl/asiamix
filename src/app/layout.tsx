import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider, themeNoFlashScript } from "@/lib/theme";
import { I18nProvider } from "@/lib/i18n";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NOMI — Доставка еды",
  description:
    "NOMI Delivery Platform — заказывайте любимую еду из ресторанов вашего города. Быстро, удобно, вкусно.",
  applicationName: "NOMI",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0f" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${manrope.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeNoFlashScript }} />
      </head>
      <body className="min-h-screen">
        <ThemeProvider>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
