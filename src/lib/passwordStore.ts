import { getClient } from './db'

const TABLE_NAME = process.env.NEON_PASSWORDS_TABLE ?? 'access_passwords'

export async function getStoredPassword(id: string): Promise<string | null> {
  const sql = getClient()
  if (!sql) return null

  try {
    const rows =
      await sql`SELECT password FROM ${sql.unsafe(TABLE_NAME)} WHERE id = ${id}`

    if (!rows.length) return null
    return rows[0].password
  } catch (err) {
    console.error('[passwordStore] getStoredPassword error:', err)
    return null
  }
}
