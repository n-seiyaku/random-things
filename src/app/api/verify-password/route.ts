import { NextRequest, NextResponse } from 'next/server'
import { banIp, isIpBanned } from '@/lib/ipBanStore'

const CORRECT_PASSWORD = '133110'
const MAX_ATTEMPTS = 5

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const ip = forwarded ? forwarded.split(',')[0].trim() : (realIp || 'unknown')
  return ip
}

// In-memory store for failed attempts (in production, use Redis or database)
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>()

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  const tenMinutesAgo = now - 10 * 60 * 1000
  for (const [ip, data] of failedAttempts.entries()) {
    if (data.lastAttempt < tenMinutesAgo) {
      failedAttempts.delete(ip)
    }
  }
}, 10 * 60 * 1000)

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)

    // Check if IP is already banned
    const alreadyBanned = await isIpBanned(ip)
    if (alreadyBanned) {
      return NextResponse.json(
        { error: 'IP is banned', banned: true },
        { status: 403 }
      )
    }

    const { password } = await req.json()

    if (password === CORRECT_PASSWORD) {
      // Reset failed attempts on success
      failedAttempts.delete(ip)
      return NextResponse.json({ success: true })
    }

    // Increment failed attempts
    const attempts = failedAttempts.get(ip) || { count: 0, lastAttempt: 0 }
    attempts.count += 1
    attempts.lastAttempt = Date.now()
    failedAttempts.set(ip, attempts)

    // Ban IP if max attempts reached
    if (attempts.count >= MAX_ATTEMPTS) {
      await banIp(ip, 24) // Ban for 24 hours
      return NextResponse.json(
        {
          error: 'Too many failed attempts. IP has been banned for 24 hours.',
          banned: true,
          attemptsRemaining: 0,
        },
        { status: 403 }
      )
    }

    return NextResponse.json(
      {
        error: 'Incorrect password',
        attemptsRemaining: MAX_ATTEMPTS - attempts.count,
      },
      { status: 401 }
    )
  } catch (error) {
    console.error('[verify-password] Error:', error)
    return NextResponse.json(
      { error: 'Failed to verify password' },
      { status: 500 }
    )
  }
}

