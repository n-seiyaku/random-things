import { getLatestOtp } from '@/lib/gmail'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // để luôn chạy server

export async function GET(req: NextRequest) {
  try {
    const result = await getLatestOtp()

    if (!result) {
      return NextResponse.json(
        { otp: null, receivedAt: null, rawText: null },
        { status: 200 }
      )
    }

    return NextResponse.json(result)
  } catch (err: unknown) {
    console.error('Error in /api/latest-otp:', err)
    return NextResponse.json({ error: 'Failed to fetch OTP' }, { status: 500 })
  }
}
