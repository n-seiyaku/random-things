'use client'

import React, { useState, useEffect } from 'react'
import PasswordScreen from './components/PasswordScreen'
import BannedScreen from './components/BannedScreen'
import Link from 'next/link'

export function GoogleConnectClient() {
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
