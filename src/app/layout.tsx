import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Providers } from '@/components/providers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Qadam — Жеке өсу платформасы',
    template: '%s | Qadam',
  },
  description:
    'Әр үлкен жетістік бір қадамнан басталады. Жеке өсу, мақсат қою, дағдыларды қадағалау және қаржыны басқару платформасы.',
  keywords: ['qadam', 'жеке өсу', 'мақсат', 'дағды', 'күнделік', 'қаржы'],
  authors: [{ name: 'Qadam' }],
  openGraph: {
    title: 'Qadam',
    description: 'Әр үлкен жетістік бір қадамнан басталады.',
    type: 'website',
    locale: 'kk_KZ',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="kk"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
