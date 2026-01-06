import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import 'material-symbols/outlined.css'
import './globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LoadingProvider } from '@/components/LoadingProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// Replace the simple metadata with a robust one
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://www.nhannt.io.vn/'),
  title: {
    default: 'Random Things - Bộ sưu tập tiện ích',
    template: '%s | Random Things',
  },
  description: 'Bộ sưu tập các công cụ và tiện ích hữu ích: QR Scanner, Code Fetcher, Google Connect và nhiều hơn nữa.',
  openGraph: {
    title: 'Random Things - Bộ sưu tập tiện ích',
    description: 'Bộ sưu tập các công cụ và tiện ích hữu ích cho developer và người dùng phổ thông.',
    url: '/',
    siteName: 'Random Things',
    locale: 'vi_VN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoadingProvider>
          <Header />
          {children}
          <SpeedInsights />
          <Footer />
        </LoadingProvider>
      </body>
    </html>
  )
}
