// lib/gmail.ts
import { google } from 'googleapis'

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Google OAuth env vars')
  }

  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret)
  oAuth2Client.setCredentials({ refresh_token: refreshToken })

  return oAuth2Client
}

export async function getLatestOtp() {
  const auth = getOAuth2Client()
  const gmail = google.gmail({ version: 'v1', auth })

  const userId = process.env.GMAIL_USER
  if (!userId) throw new Error('GMAIL_USER is not set')

  const query =
    process.env.OTP_SEARCH_QUERY ??
    'subject:(OTP OR verification code) newer_than:1d'

  // 1. Lấy danh sách mail match query, mới nhất trước
  const res = await gmail.users.messages.list({
    userId,
    q: query,
    maxResults: 5,
  })

  const messages = res.data.messages
  if (!messages || messages.length === 0) {
    return null
  }

  // Cứ lấy mail mới nhất (đầu list)
  const latestMsgId = messages[0].id!
  const msgRes = await gmail.users.messages.get({
    userId,
    id: latestMsgId,
    format: 'full',
  })

  const msg = msgRes.data
  const internalDate = msg.internalDate
    ? new Date(Number(msg.internalDate))
    : new Date()

  // Extract text từ payload
  const bodyText = extractPlainTextFromMessage(msg)

  // Regex bắt OTP (ví dụ 6 chữ số)
  const otp = extractOtpFromText(bodyText)

  return {
    otp,
    receivedAt: internalDate.toISOString(),
    rawText: bodyText,
  }
}

function extractPlainTextFromMessage(
  msg: import('googleapis/build/src/apis/gmail/v1').gmail_v1.Schema$Message
): string {
  const payload = msg.payload
  if (!payload) return ''

  // Nếu là multipart
  if (payload.parts && payload.parts.length > 0) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return decodeBase64Url(part.body.data)
      }
    }
  }

  // Nếu body trực tiếp
  if (payload.body?.data) {
    return decodeBase64Url(payload.body.data)
  }

  return ''
}

function decodeBase64Url(data: string): string {
  const decoded = Buffer.from(
    data.replace(/-/g, '+').replace(/_/g, '/'),
    'base64'
  ).toString('utf8')
  return decoded
}

function extractOtpFromText(text: string | null | undefined): string | null {
  if (!text) return null

  // Ví dụ: "Your OTP is 123456" hoặc "OTP: 123456"
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
