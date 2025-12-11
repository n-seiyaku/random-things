import { getLatestOtp } from '@/lib/gmail'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // để luôn chạy server

export async function GET(req: NextRequest) {
  try {
    // simple auth để không ai gọi trộm API
    const token = req.headers.get('x-otp-auth')
    const expected = process.env.OTP_AUTH_TOKEN

    if (!expected || token !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
