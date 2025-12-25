// app/google-connect/page.tsx
'use client'

import Link from 'next/link'

export default function GoogleConnectPage() {
  const handleConnect = () => {
    window.location.href = '/api/google/auth-url'
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      {/* Background: soft vignette + subtle grid/noise-ish */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.10)_0%,rgba(0,0,0,0)_48%),radial-gradient(ellipse_at_top,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0)_55%)]" />
        <div className="absolute inset-0 bg-linear-to-br from-black via-zinc-950 to-zinc-900" />
        <div className="mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_100%) absolute inset-0 bg-black/60" />
      </div>

      {/* Top bar */}
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-zinc-700/70" />
          <p className="text-[11px] font-medium tracking-[0.35em] text-zinc-400 uppercase">
            OTP STUDIO
          </p>
          <span className="h-px w-10 bg-zinc-700/70" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800/80 bg-zinc-950/70 px-3 py-1.5 backdrop-blur">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
          <span className="text-xs text-zinc-300">Secure OAuth</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative mx-auto flex w-full max-w-6xl items-start justify-center px-5 pt-2 pb-16">
        <div className="relative w-full max-w-3xl">
          {/* Outer glow accents */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

          {/* Card */}
          <div className="rounded-[28px] border border-zinc-800/70 bg-zinc-950/70 p-8 shadow-[0_22px_70px_-35px_rgba(0,0,0,0.9)] backdrop-blur-xl md:p-10">
            {/* Header row */}
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-5xl">
                  Google Connect
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
                  Kết nối Gmail OTP để lấy{' '}
                  <span className="rounded-full bg-zinc-900/70 px-2 py-0.5 font-mono text-xs text-emerald-300 ring-1 ring-emerald-500/30">
                    refresh_token
                  </span>{' '}
                  (chỉ cần làm một lần). Token này dùng để server đọc email OTP
                  tự động.
                </p>
              </div>
            </div>

            {/* Inner panel (like OTP box) */}
            <div className="mt-8 rounded-[22px] border border-zinc-800/70 bg-zinc-950/60 p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] md:p-7">
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
                    Back to app
                  </Link>

                  <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                    Tip: chỉ tạo token 1 lần. Đừng chạy flow OAuth lại khi
                    redeploy để tránh revoke token cũ.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-9 flex items-center justify-between border-t border-zinc-800/60 pt-5">
              <p className="text-xs text-zinc-500">
                github.com/n-seiyaku · OTP utility viewer
              </p>
              <p className="text-xs text-zinc-600">
                Premium dark · emerald neon
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
