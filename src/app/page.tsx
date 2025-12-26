import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-900 via-black to-zinc-900 px-4 pt-20 pb-10 text-zinc-50">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-10 flex flex-col gap-2 text-center">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-zinc-400 uppercase">
              <span className="h-px w-6 bg-zinc-600" />
              Random Things Studio
              <span className="h-px w-6 bg-zinc-600" />
            </span>
          </div>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Chọn công cụ bạn cần
          </h1>
          <p className="text-sm text-zinc-400">
            Bộ sưu tập các tiện ích hữu ích
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/qr-scanner"
            className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 shadow-[0_22px_70px_-35px_rgba(0,0,0,0.9)] backdrop-blur transition hover:border-emerald-500/50 hover:bg-zinc-950/90"
          >
            <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl transition group-hover:bg-emerald-500/20" />
            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                QR Scanner
              </div>
              <h2 className="mb-2 text-lg font-semibold">QR Code Scanner</h2>
              <p className="text-xs text-zinc-400">
                Quét QR code từ camera hoặc hình ảnh
              </p>
            </div>
          </Link>

          <Link
            href="/code-fetcher"
            className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 shadow-[0_22px_70px_-35px_rgba(0,0,0,0.9)] backdrop-blur transition hover:border-emerald-500/50 hover:bg-zinc-950/90"
          >
            <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl transition group-hover:bg-emerald-500/20" />
            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                OTP Viewer
              </div>
              <h2 className="mb-2 text-lg font-semibold">Code Fetcher</h2>
              <p className="text-xs text-zinc-400">
                Đọc mã OTP từ Gmail tự động
              </p>
            </div>
          </Link>
        </div>

        <p className="mt-10 text-center text-[10px] text-zinc-600">
          github.com/n-seiyaku · Random Things Studio
        </p>
      </div>
    </div>
  )
}
