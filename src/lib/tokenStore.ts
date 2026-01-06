import { getClient } from './db'

type StoredTokens = {
  accessToken?: string | null
  refreshToken?: string | null
  expiresAt?: number | null
}

const TABLE_NAME = process.env.NEON_TOKENS_TABLE ?? 'google_tokens'

const TOKEN_ROW_ID = process.env.NEON_TOKENS_ID ?? 'gmail'

export async function getStoredTokens(): Promise<StoredTokens | null> {
  const sql = getClient()
  if (!sql) {
    console.warn('[tokenStore] No DB client; skipping fetch')
    return null
  }

  try {
    // Use a template function for safe and convenient parameter usage
    const rows =
      await sql`SELECT * FROM ${sql.unsafe(TABLE_NAME)} WHERE id = ${TOKEN_ROW_ID}`

    if (!rows.length) {
      console.warn('[tokenStore] No row found for id', TOKEN_ROW_ID)
      return null
    }

    const row = rows[0]

    return {
      accessToken: row.access_token,
      refreshToken: row.refresh_token,
      expiresAt: row.expires_at,
    }
  } catch (err) {
    console.error('Neon getStoredTokens error:', err)
    return null
  }
}

export async function saveTokens({
  accessToken,
  refreshToken,
  expiresAt,
}: {
  accessToken?: string | null
  refreshToken?: string | null
  expiresAt?: number | null
}) {
  const sql = getClient()
  if (!sql) {
    console.warn('[tokenStore] No DB client; skipping save')
    return
  }

  try {
    // Use parameterized query with ON CONFLICT to update if exists
    await sql`
      INSERT INTO ${sql.unsafe(TABLE_NAME)} (id, access_token, refresh_token, expires_at)
      VALUES (${TOKEN_ROW_ID}, ${accessToken}, ${refreshToken}, ${expiresAt})
      ON CONFLICT (id) DO UPDATE SET
        access_token = EXCLUDED.access_token,
        refresh_token = EXCLUDED.refresh_token,
        expires_at = EXCLUDED.expires_at
    `
    console.log('[tokenStore] Tokens saved/updated successfully')
  } catch (err) {
    console.error('[tokenStore] Save tokens error:', err)
    throw err // Re-throw for route handler to catch
  }
}
