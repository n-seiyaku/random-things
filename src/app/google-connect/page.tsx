import { Metadata } from 'next'
import { GoogleConnectClient } from './GoogleConnectClient'

export const metadata: Metadata = {
  title: 'Google Connect',
}

export default function GoogleConnectPage() {
  return <GoogleConnectClient />
}
