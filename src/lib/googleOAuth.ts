// lib/googleOAuth.ts
import { google } from 'googleapis'

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

export function getOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing Google OAuth environment variables')
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri)
}

export function generateAuthUrl() {
  const oAuth2Client = getOAuthClient()

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline', // to get refresh_token
    prompt: 'consent', // force Google to re-prompt -> always return refresh_token
    scope: SCOPES,
  })

  return authUrl
}

export async function exchangeCodeForTokens(code: string) {
  const oAuth2Client = getOAuthClient()

  const { tokens } = await oAuth2Client.getToken(code)
  return tokens // { access_token, refresh_token, expiry_date, ... }
}
