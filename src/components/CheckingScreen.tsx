'use client'

export function CheckingScreen() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-900 via-black to-zinc-900 px-4 pt-20 pb-10 text-zinc-50">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-emerald-500" />
        <p className="text-sm text-zinc-400">Đang kiểm tra quyền truy cập...</p>
      </div>
    </div>
  )
}
