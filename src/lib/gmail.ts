const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1'
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'

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

/**
 * Lấy access_token từ refresh_token (server-side, chạy trong Worker)
 */
async function getAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Google OAuth env vars')
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
    throw new Error(
      `Failed to get access token: ${res.status} ${JSON.stringify(data)}`
    )
  }

  if (!data.access_token) {
    throw new Error('No access_token in token response')
  }

  return data.access_token as string
}

/**
 * Gọi Gmail API list messages bằng fetch
 */
async function listMessages(query: string, maxResults = 5) {
  const userId = process.env.GMAIL_USER || 'me'
  const accessToken = await getAccessToken()

  const url = new URL(
    `${GMAIL_API_BASE}/users/${encodeURIComponent(userId)}/messages`
  )
  url.searchParams.set('q', query)
  url.searchParams.set('maxResults', String(maxResults))

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(
      `Failed to list messages: ${res.status} ${JSON.stringify(data)}`
    )
  }

  return (data.messages ?? []) as { id: string }[]
}

/**
 * Gọi Gmail API get message full
 */
async function getMessage(messageId: string): Promise<GmailMessage> {
  const userId = process.env.GMAIL_USER || 'me'
  const accessToken = await getAccessToken()

  const url = new URL(
    `${GMAIL_API_BASE}/users/${encodeURIComponent(userId)}/messages/${encodeURIComponent(messageId)}`
  )
  url.searchParams.set('format', 'full')

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(
      `Failed to get message: ${res.status} ${JSON.stringify(data)}`
    )
  }

  return data as GmailMessage
}

/**
 * Hàm public đang được /api/latest-otp dùng
 */
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

/**
 * Lấy text/plain từ payload
 */
function extractPlainTextFromMessage(msg: GmailMessage): string {
  const payload = msg.payload
  if (!payload) return ''

  // Nếu multipart thì duyệt parts
  if (payload.parts && payload.parts.length > 0) {
    const textPart = findTextPart(payload.parts)
    if (textPart?.body?.data) {
      return decodeBase64Url(textPart.body.data)
    }
  }

  // Nếu body trực tiếp
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

/**
 * Giải mã base64url safe string → UTF-8
 */
function decodeBase64Url(data: string): string {
  const base64 = data.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const binary = atob(padded)

  // Chuyển binary string → UTF-8 string
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

/**
 * Regex bắt OTP trong text
 */
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
