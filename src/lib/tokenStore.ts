import { neon } from '@neondatabase/serverless'

type StoredTokens = {
  accessToken?: string | null
  refreshToken?: string | null
  expiresAt?: number | null
}

const TABLE_NAME = process.env.NEON_TOKENS_TABLE ?? 'google_tokens'

const TOKEN_ROW_ID = process.env.NEON_TOKENS_ID ?? 'gmail'

function getConnectionString() {
  const conn =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    null
  return conn
}

function getClient() {
  const connectionString = getConnectionString()
  if (!connectionString) return null
  return neon(connectionString)
}

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
  if (!sql) return

  try {
    const query = `
      insert into "${TABLE_NAME}" (id, access_token, refresh_token, expires_at)
      values ('${TOKEN_ROW_ID}', ${
        accessToken ? `'${accessToken}'` : 'null'
      }, ${
        refreshToken ? `'${refreshToken}'` : 'null'
      }, ${typeof expiresAt === 'number' ? expiresAt : 'null'})
      on conflict (id) do update set
        access_token = excluded.access_token,
        refresh_token = excluded.refresh_token,
        expires_at = excluded.expires_at;
    `
    await sql.unsafe(query)
  } catch (err) {
    console.error('Neon saveTokens error:', err)
  }
}
