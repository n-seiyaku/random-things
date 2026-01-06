import { getStoredTokens, saveTokens } from './tokenStore'

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1'
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'

type TokenCache = {
  accessToken: string | null
  expiresAt: number | null
  refreshToken: string
}

const ACCESS_TOKEN_SAFETY_WINDOW_MS = 60_000

let tokenCache: TokenCache | null = null

type GmailMessage = {
  id?: string
  internalDate?: string
  payload?: {
    mimeType?: string
    body?: { data?: string | null } | null
    parts?: GmailPart[] | null
  } | null
}

type GmailPart = {
  mimeType?: string
  body?: { data?: string | null } | null
  parts?: GmailPart[] | null
}

// Retrieve access_token from refresh_token (server-side, runs in Worker)
async function getAccessToken(forceRefresh = false): Promise<string | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const envRefreshToken = process.env.GOOGLE_REFRESH_TOKEN

  if (!clientId || !clientSecret) {
    throw new Error('Missing Google OAuth env vars')
  }

  if (!tokenCache) {
    const stored = await getStoredTokens()
    if (stored?.refreshToken) {
      tokenCache = {
        accessToken: stored.accessToken ?? null,
        expiresAt: stored.expiresAt ?? null,
        refreshToken: stored.refreshToken,
      }
    }
  }

  if (
    !forceRefresh &&
    tokenCache &&
    tokenCache.accessToken &&
    tokenCache.expiresAt &&
    tokenCache.expiresAt - ACCESS_TOKEN_SAFETY_WINDOW_MS > Date.now()
  ) {
    return tokenCache.accessToken
  }

  const refreshToken =
    tokenCache?.refreshToken ??
    envRefreshToken ??
    (await getStoredTokens())?.refreshToken ??
    null

  if (!refreshToken) {
    console.error('[gmail] No refresh token found in cache/env/DB')
    throw new Error(
      'Missing refresh token. Add GOOGLE_REFRESH_TOKEN or store in Neon/Postgres.'
    )
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  })

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  const data = await res.json()

  if (!res.ok) {
    const message = JSON.stringify(data)
    if (typeof data?.error === 'string' && data.error === 'invalid_grant') {
      throw new Error(
        'Refresh token expired or revoked. Go to /google-connect to login again and get a new refresh_token. '
      )
    }

    throw new Error(`Failed to get access token: ${res.status} ${message}`)
  }

  if (!data.access_token) {
    throw new Error('No access_token in token response')
  }

  const expiresIn = Number(data.expires_in ?? 3600)

  tokenCache = {
    accessToken: data.access_token as string,
    expiresAt: Date.now() + expiresIn * 1000,
    refreshToken,
  }

  // If Google issues a new refresh_token (rare), update cache for next use
  if (typeof data.refresh_token === 'string' && data.refresh_token.length > 0) {
    tokenCache.refreshToken = data.refresh_token
  }

  try {
    await saveTokens({
      accessToken: tokenCache.accessToken,
      refreshToken: tokenCache.refreshToken,
      expiresAt: tokenCache.expiresAt,
    })
  } catch (err) {
    console.error('Persist token to Neon failed:', err)
  }

  return tokenCache.accessToken
}

// Call Gmail API list messages using fetch
async function listMessages(query: string, maxResults = 5) {
  const userId = process.env.GMAIL_USER || 'me'

  const url = new URL(
    `${GMAIL_API_BASE}/users/${encodeURIComponent(userId)}/messages`
  )
  url.searchParams.set('q', query)
  url.searchParams.set('maxResults', String(maxResults))

  const res = await fetchWithAutoRefresh(url)
  const data = await res.json()

  if (!res.ok) {
    throw new Error(
      `Failed to list messages: ${res.status} ${JSON.stringify(data)}`
    )
  }

  return (data.messages ?? []) as { id: string }[]
}

// Call Gmail API get message full
async function getMessage(messageId: string): Promise<GmailMessage> {
  const userId = process.env.GMAIL_USER || 'me'

  const url = new URL(
    `${GMAIL_API_BASE}/users/${encodeURIComponent(userId)}/messages/${encodeURIComponent(messageId)}`
  )
  url.searchParams.set('format', 'full')

  const res = await fetchWithAutoRefresh(url)
  const data = await res.json()

  if (!res.ok) {
    throw new Error(
      `Failed to get message: ${res.status} ${JSON.stringify(data)}`
    )
  }

  return data as GmailMessage
}

async function fetchWithAutoRefresh(url: URL) {
  const accessToken = await getAccessToken()

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (res.status === 401 || res.status === 403) {
    // access_token might be expired -> try refreshing once
    const retryToken = await getAccessToken(true)
    const retryRes = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${retryToken}`,
      },
    })

    return retryRes
  }

  return res
}

// Public function used by /api/latest-otp
export async function getLatestOtp() {
  const query =
    process.env.OTP_SEARCH_QUERY ??
    'subject:(OTP OR verification code) newer_than:1d'

  const messages = await listMessages(query, 5)

  if (!messages.length) {
    return null
  }

  const latestId = messages[0].id
  if (!latestId) return null

  const msg = await getMessage(latestId)

  const internalDate = msg.internalDate
    ? new Date(Number(msg.internalDate))
    : new Date()

  const bodyText = extractPlainTextFromMessage(msg)
  const otp = extractOtpFromText(bodyText)

  return {
    otp,
    receivedAt: internalDate.toISOString(),
    rawText: bodyText,
  }
}

// Extract text/plain from payload
function extractPlainTextFromMessage(msg: GmailMessage): string {
  const payload = msg.payload
  if (!payload) return ''

  // If multipart, iterate parts
  if (payload.parts && payload.parts.length > 0) {
    const textPart = findTextPart(payload.parts)
    if (textPart?.body?.data) {
      return decodeBase64Url(textPart.body.data)
    }
  }

  // If body direct
  if (payload.body?.data) {
    return decodeBase64Url(payload.body.data)
  }

  return ''
}

function findTextPart(parts: GmailPart[]): GmailPart | null {
  for (const part of parts) {
    if (part.mimeType === 'text/plain' && part.body?.data) {
      return part
    }
    if (part.parts && part.parts.length) {
      const child = findTextPart(part.parts)
      if (child) return child
    }
  }
  return null
}

// Decode base64url safe string -> UTF-8
function decodeBase64Url(data: string): string {
  const base64 = data.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)

  // Prioritize atob (available on browser/Cloudflare), fallback Buffer on Node
  if (typeof atob === 'function') {
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(padded, 'base64').toString('utf-8')
  }

  throw new Error('No base64 decoder available in this runtime')
}

// Regex to catch OTP in text
function extractOtpFromText(text: string | null | undefined): string | null {
  if (!text) return null

  const regexList = [
    /OTP[^0-9]*?(\d{4,8})/i,
    /verification code[^0-9]*?(\d{4,8})/i,
    /\b(\d{4,8})\b/,
  ]

  for (const regex of regexList) {
    const match = text.match(regex)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}
