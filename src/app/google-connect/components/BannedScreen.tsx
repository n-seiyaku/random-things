'use client'

import React from 'react'
import Link from 'next/link'

export default function BannedScreen() {
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
