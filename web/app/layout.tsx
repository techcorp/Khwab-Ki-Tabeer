import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Amiri } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const amiri = Amiri({ 
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-amiri"
});

export const metadata: Metadata = {
  title: 'Khawab Ki Tabeer - Islamic Dream Interpretation',
  description: 'AI-powered Islamic dream interpretation with duas and encyclopedia. Get interpretations based on Quran and Hadith.',
  keywords: ['dream interpretation', 'Islamic dreams', 'khawab ki tabeer', 'dream meaning', 'Islamic guidance'],
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${amiri.variable} font-sans antialiased min-h-screen`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
