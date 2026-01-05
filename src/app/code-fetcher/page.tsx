import { Metadata } from 'next'
import { CodeFetcherClient } from './CodeFetcherClient'

export const metadata: Metadata = {
  title: 'Code Fetcher',
}

export default function CodeFetcherPage() {
  return <CodeFetcherClient />
}
