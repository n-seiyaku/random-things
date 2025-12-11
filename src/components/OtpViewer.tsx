'use client'

import { useEffect, useState, useCallback } from 'react'

type OtpResponse = {
  otp: string | null
  receivedAt: string | null
  rawText: string | null
  error?: string
}

export function OtpViewer() {
  const [data, setData] = useState<OtpResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const pollInterval = Number(process.env.NEXT_PUBLIC_POLL_INTERVAL_MS ?? 15000)
  const authToken = process.env.NEXT_PUBLIC_OTP_AUTH_TOKEN

  const fetchOtp = useCallback(async () => {
    if (!authToken) {
      setError('Missing NEXT_PUBLIC_OTP_AUTH_TOKEN')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/latest-otp', {
        headers: {
          'x-otp-auth': authToken,
        },
      })

      const text = await res.text()

      let json: OtpResponse
      try {
        json = JSON.parse(text)
      } catch {
        console.error('Raw response from /api/latest-otp:', text)
        throw new Error(
          `API không trả JSON. Status ${res.status}. Body: ${text.slice(
            0,
            120
          )}...`
        )
      }

      if (!res.ok) {
        setError(json.error ?? `Request failed with status ${res.status}`)
      } else {
        setData(json)
        setLastUpdated(new Date())
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Network error'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [authToken])

  useEffect(() => {
    fetchOtp()
    const id = setInterval(fetchOtp, pollInterval)
    return () => clearInterval(id)
  }, [fetchOtp, pollInterval])

  const copyOtp = async () => {
    if (!data?.otp) return
    try {
      await navigator.clipboard.writeText(data.otp)
      setToast('Đã copy OTP vào clipboard')
      setTimeout(() => setToast(null), 2000)
    } catch {
      setToast('Không copy được, thử lại nhé')
      setTimeout(() => setToast(null), 2000)
    }
  }

  const clearOtp = () => {
    setData(null)
    setError(null)
  }

  const statusColor =
    error != null
      ? 'text-rose-400'
      : loading
        ? 'text-amber-400'
        : data?.otp
          ? 'text-emerald-400'
          : 'text-zinc-400'

  const statusLabel =
    error != null
      ? 'Lỗi khi đọc OTP'
      : loading
        ? 'Đang kiểm tra hộp thư…'
        : data?.otp
          ? 'Đã có OTP mới'
          : 'Đang chờ OTP mới'

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-950 via-black to-zinc-900 px-4 py-10 text-zinc-50">
      {/* Toast nhỏ bên dưới */}
      {toast && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-emerald-500/40 bg-zinc-900/90 px-4 py-2 text-xs text-emerald-50 shadow-[0_18px_60px_-28px_rgba(16,185,129,0.9)]">
          {toast}
        </div>
      )}

      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-zinc-400 uppercase">
            <span className="h-px w-6 bg-zinc-600" />
            OTP Studio
            <span className="h-px w-6 bg-zinc-600" />
          </span>

          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1 text-[11px] text-zinc-400">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500/70 shadow-[0_0_0_6px_rgba(16,185,129,0.35)]" />
            Auto refresh {pollInterval / 1000}s
          </span>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-zinc-800/70 bg-zinc-950/80 p-6 shadow-[0_22px_70px_-35px_rgba(0,0,0,0.9)] backdrop-blur">
          {/* ánh sáng góc card */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative space-y-6">
            {/* Header + status */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Code Fetcher
                </h1>
                <p className="mt-1 text-xs text-zinc-400">
                  Đọc mã OTP từ Gmail trung gian và hiển thị cho người dùng lấy
                  nhanh.
                </p>
              </div>

              <div className="flex flex-col items-end gap-1 text-right">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border border-zinc-700/70 bg-zinc-900/60 px-3 py-1 text-[11px] font-medium ${statusColor}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {statusLabel}
                </span>
                <span className="text-[10px] text-zinc-500">
                  Lần cập nhật cuối:{' '}
                  {lastUpdated
                    ? lastUpdated.toLocaleTimeString()
                    : 'chưa có dữ liệu'}
                </span>
              </div>
            </div>

            {/* OTP big */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">
                  MÃ OTP MỚI NHẤT
                </p>

                <div className="flex gap-2 text-[11px] text-zinc-500">
                  <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5">
                    {data?.receivedAt
                      ? new Date(data.receivedAt).toLocaleTimeString()
                      : 'Chưa có'}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="flex-1 text-center">
                  <p className="font-mono text-4xl tracking-[0.35em] text-zinc-50 sm:text-5xl">
                    {data?.otp ?? '——————'}
                  </p>
                </div>

                <div className="flex flex-col gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={fetchOtp}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 font-medium text-zinc-100 shadow-sm transition hover:border-zinc-500 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? 'Đang tải…' : 'Refresh'}
                  </button>

                  <button
                    type="button"
                    onClick={copyOtp}
                    disabled={!data?.otp}
                    className="inline-flex items-center justify-center gap-1 rounded-full border border-emerald-600/70 bg-emerald-700/80 px-3 py-1.5 font-medium text-emerald-50 shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Copy OTP
                  </button>

                  <button
                    type="button"
                    onClick={clearOtp}
                    className="inline-flex items-center justify-center gap-1 rounded-full border border-zinc-700/80 bg-transparent px-3 py-1.5 font-medium text-zinc-300 shadow-sm transition hover:bg-zinc-900"
                  >
                    Xoá dữ liệu
                  </button>
                </div>
              </div>
            </div>

            {/* Meta info + error */}
            <div className="grid gap-3 text-xs text-zinc-400 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="font-medium text-zinc-300">Thông tin email</p>
                <p>
                  Received at:{' '}
                  <span className="text-zinc-300">
                    {data?.receivedAt
                      ? new Date(data.receivedAt).toLocaleString()
                      : 'chưa có'}
                  </span>
                </p>
                <p>
                  Poll interval:{' '}
                  <span className="text-zinc-300">
                    {pollInterval / 1000} giây
                  </span>
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-medium text-zinc-300">Trạng thái hệ thống</p>
                {error ? (
                  <p className="text-rose-400">
                    Error: <span className="text-rose-300">{error}</span>
                  </p>
                ) : (
                  <p>Không có lỗi nào được ghi nhận.</p>
                )}
                <p className="text-[10px] text-zinc-500">
                  Gmail account &amp; token chỉ nên dùng cho 1 hộp thư OTP
                  riêng, tránh dùng mail cá nhân.
                </p>
              </div>
            </div>

            <p className="pt-2 text-right text-[10px] text-zinc-600">
              github.com/n-seiyaku · OTP utility viewer
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
