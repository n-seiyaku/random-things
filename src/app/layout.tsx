import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import 'material-symbols/outlined.css'
import './globals.css'
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

export const metadata: Metadata = {
  title: 'Random Things Studio',
  description: 'Bộ sưu tập các tiện ích hữu ích',
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
          <Footer />
        </LoadingProvider>
      </body>
    </html>
  )
}
