import { NextRequest, NextResponse } from 'next/server'
import { isIpBanned } from '@/lib/ipBanStore'

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const ip = forwarded ? forwarded.split(',')[0].trim() : (realIp || 'unknown')
  return ip
}

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const banned = await isIpBanned(ip)

    return NextResponse.json({ banned, ip })
  } catch (error) {
    console.error('[check-ban] Error:', error)
    return NextResponse.json(
      { error: 'Failed to check ban status' },
      { status: 500 }
    )
  }
}

