import { getClient } from './db'

const TABLE_NAME = process.env.NEON_BANNED_IPS_TABLE ?? 'banned_ips'

export async function isIpBanned(ip: string): Promise<boolean> {
  const sql = getClient()
  if (!sql) {
    console.warn('[ipBanStore] No DB client; skipping ban check')
    return false
  }

  try {
    const rows =
      await sql`SELECT * FROM ${sql.unsafe(TABLE_NAME)} WHERE ip = ${ip} AND banned_until > NOW()`

    return rows.length > 0
  } catch (err) {
    console.error('[ipBanStore] Check ban error:', err)
    return false
  }
}

export async function banIp(ip: string, hours: number = 24): Promise<void> {
  const sql = getClient()
  if (!sql) {
    console.warn('[ipBanStore] No DB client; skipping ban')
    return
  }

  try {
    const bannedUntil = new Date()
    bannedUntil.setHours(bannedUntil.getHours() + hours)

    await sql`
      INSERT INTO ${sql.unsafe(TABLE_NAME)} (ip, banned_at, banned_until)
      VALUES (${ip}, NOW(), ${bannedUntil.toISOString()})
      ON CONFLICT (ip) DO UPDATE SET
        banned_at = NOW(),
        banned_until = ${bannedUntil.toISOString()}
    `
    console.log(`[ipBanStore] IP ${ip} banned until ${bannedUntil.toISOString()}`)
  } catch (err) {
    console.error('[ipBanStore] Ban IP error:', err)
    throw err
  }
}

