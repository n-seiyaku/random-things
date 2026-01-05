// app/google-connect/page.tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

function PasswordScreen({
  onSuccess,
  onBanned,
}: {
  onSuccess: () => void
  onBanned: () => void
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
        body: JSON.stringify({ password }),
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
    } catch (err) {
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

function BannedScreen() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-900 via-black to-zinc-900 px-4 pt-20 pb-10 text-zinc-50">
      <div className="mx-auto w-full max-w-2xl text-center">
        <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/70 p-8 shadow-[0_22px_70px_-35px_rgba(0,0,0,0.9)] backdrop-blur">
          <div className="mb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 ring-1 ring-rose-500/30">
              <svg
                className="h-8 w-8 text-rose-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-semibold text-zinc-50">
              IP của bạn đã bị cấm
            </h1>
            <p className="text-sm text-zinc-400">
              Bạn đã nhập sai mật khẩu quá nhiều lần. IP của bạn đã bị cấm trong
              24 giờ.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-zinc-800/80 bg-zinc-950/50 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-900/60 hover:text-zinc-50"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}

function GoogleConnectContent() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [isBanned, setIsBanned] = useState(false)

  useEffect(() => {
    const checkBan = async () => {
      try {
        const res = await fetch('/api/check-ban')
        const data = await res.json()

        if (data.banned) {
          setIsBanned(true)
        }
      } catch (err) {
        console.error('Failed to check ban status:', err)
      } finally {
        setIsChecking(false)
      }
    }

    checkBan()
  }, [])

  const handleConnect = () => {
    window.location.href = '/api/google/auth-url'
  }

  if (isChecking) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-900 via-black to-zinc-900 px-4 pt-20 pb-10 text-zinc-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-emerald-500" />
          <p className="text-sm text-zinc-400">
            Đang kiểm tra quyền truy cập...
          </p>
        </div>
      </div>
    )
  }

  if (isBanned) {
    return <BannedScreen />
  }

  if (!isAuthorized) {
    return (
      <PasswordScreen
        onSuccess={() => setIsAuthorized(true)}
        onBanned={() => setIsBanned(true)}
      />
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-900 via-black to-zinc-900 px-4 pt-20 pb-10 text-zinc-50">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-10 flex flex-col gap-2 text-center">
          <div className="flex justify-between">
            <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-zinc-400 uppercase">
              <span className="h-px w-6 bg-zinc-600" />
              Gmail OAuth
              <span className="h-px w-6 bg-zinc-600" />
            </span>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/70 px-3 py-1.5 backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
              <span className="text-xs text-zinc-300">Secure OAuth</span>
            </div>
          </div>

          <h1 className="text-3xl font-semibold sm:text-4xl">Google Connect</h1>
          <p className="text-sm text-zinc-400">
            Kết nối Gmail để lấy OAuth token
          </p>
        </div>

        <div className="relative w-full">
          {/* Outer glow accents */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

          {/* Card */}
          <div className="relative rounded-2xl border border-zinc-800/70 bg-zinc-950/70 p-6 shadow-[0_22px_70px_-35px_rgba(0,0,0,0.9)] backdrop-blur md:p-8">
            <div className="relative space-y-6">
              <div>
                <p className="text-sm leading-relaxed text-zinc-400">
                  Kết nối Gmail OTP để lấy{' '}
                  <span className="rounded-full bg-zinc-900/70 px-2 py-0.5 font-mono text-xs text-emerald-300 ring-1 ring-emerald-500/30">
                    refresh_token
                  </span>{' '}
                  (chỉ cần làm một lần). Token này dùng để server đọc email OTP
                  tự động.
                </p>
              </div>

              {/* Inner panel (like OTP box) */}
              <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/60 p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] md:p-7">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold tracking-[0.32em] text-zinc-500 uppercase">
                      Các bước thực hiện
                    </p>

                    <ol className="mt-4 space-y-2 text-sm text-zinc-300">
                      <li className="flex gap-2">
                        <span className="mt-0.5 inline-flex h-5 min-w-[1.4rem] items-center justify-center rounded-full bg-zinc-900/70 font-mono text-[0.7rem] text-emerald-300 ring-1 ring-emerald-500/30">
                          1
                        </span>
                        <span>Bấm nút “Connect Gmail”.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-0.5 inline-flex h-5 min-w-[1.4rem] items-center justify-center rounded-full bg-zinc-900/70 font-mono text-[0.7rem] text-emerald-300 ring-1 ring-emerald-500/30">
                          2
                        </span>
                        <span>Đăng nhập đúng Gmail nhận OTP.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-0.5 inline-flex h-5 min-w-[1.4rem] items-center justify-center rounded-full bg-zinc-900/70 font-mono text-[0.7rem] text-emerald-300 ring-1 ring-emerald-500/30">
                          3
                        </span>
                        <span>
                          Chọn{' '}
                          <span className="font-semibold text-zinc-100">
                            Allow
                          </span>
                          .
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-0.5 inline-flex h-5 min-w-[1.4rem] items-center justify-center rounded-full bg-zinc-900/70 font-mono text-[0.7rem] text-emerald-300 ring-1 ring-emerald-500/30">
                          4
                        </span>
                        <span>
                          Copy{' '}
                          <span className="font-mono tracking-wide text-emerald-300">
                            refresh_token
                          </span>{' '}
                          và lưu vào{' '}
                          <span className="font-mono text-zinc-200">.env</span>.
                        </span>
                      </li>
                    </ol>
                  </div>

                  {/* Action column like in screenshot */}
                  <div className="flex shrink-0 flex-col items-stretch gap-2 md:w-56">
                    <button
                      onClick={handleConnect}
                      className="group inline-flex items-center justify-center gap-2 rounded-full border border-emerald-400/60 bg-emerald-500/10 px-5 py-2.5 text-sm font-medium text-emerald-100 shadow-[0_0_25px_rgba(16,185,129,0.45)] transition hover:border-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
                    >
                      <span className="h-2 w-2 rounded-full bg-emerald-400/80 shadow-[0_0_14px_rgba(52,211,153,0.95)] transition group-hover:scale-110" />
                      Connect Gmail
                    </button>

                    <Link
                      href="/"
                      className="inline-flex items-center justify-center rounded-full border border-zinc-800/80 bg-zinc-950/50 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-900/60 hover:text-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/60"
                    >
                      Về trang chủ
                    </Link>

                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                      Tip: chỉ tạo token 1 lần. Đừng chạy flow OAuth lại khi
                      redeploy để tránh revoke token cũ.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GoogleConnectPage() {
  return <GoogleConnectContent />
}
