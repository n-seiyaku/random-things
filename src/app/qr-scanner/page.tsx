import type { Metadata } from 'next'
import QrScannerPageClient from './QrScannerPageClient'

export const metadata: Metadata = {
  title: 'QR Scanner',
}

export default function QrScannerPage() {
  return <QrScannerPageClient />
}
