'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function PasswordScreen({
  onSuccess,
  onBanned,
  passwordKey,
}: {
  onSuccess: () => void
  onBanned: () => void
  passwordKey?: string
}) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(
    null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, key: passwordKey }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        onSuccess()
      } else {
        if (data.banned) {
          onBanned()
        } else {
          setError(data.error || 'Mật khẩu không đúng')
          setAttemptsRemaining(data.attemptsRemaining ?? null)
          setPassword('')
        }
      }
    } catch (err: unknown) {
      console.error(err)
      setError('Lỗi khi xác thực. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-900 via-black to-zinc-900 px-4 pt-20 pb-10 text-zinc-50">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/70 p-8 shadow-[0_22px_70px_-35px_rgba(0,0,0,0.9)] backdrop-blur">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
              <svg
                className="h-8 w-8 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-semibold text-zinc-50">
              Yêu cầu mật khẩu
            </h1>
            <p className="text-sm text-zinc-400">
              Vui lòng nhập mật khẩu để truy cập
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-50 placeholder:text-zinc-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                autoFocus
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
                {error}
                {attemptsRemaining !== null && (
                  <p className="mt-1 text-xs text-rose-400">
                    Còn lại {attemptsRemaining} lần thử
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !password}
              className="w-full rounded-full border border-emerald-400/60 bg-emerald-500/10 px-5 py-3 text-sm font-medium text-emerald-100 shadow-[0_0_25px_rgba(16,185,129,0.45)] transition hover:border-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Đang xác thực...' : 'Xác thực'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-zinc-500 transition hover:text-zinc-300"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
