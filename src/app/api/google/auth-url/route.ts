import { NextResponse } from 'next/server'
import { generateAuthUrl } from '@/lib/googleOAuth'

export async function GET() {
  try {
    const url = generateAuthUrl()
    // Redirect thẳng user sang trang login Google
    return NextResponse.redirect(url)
  } catch (e) {
    console.error(e)
    return new NextResponse('Failed to generate auth URL', { status: 500 })
  }
}
