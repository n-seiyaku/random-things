import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Random Things',
  description: 'Terms of Service for Random Things app',
}

export default function TermsOfServicePage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-950 via-black to-zinc-900 px-4 py-20 text-zinc-50">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-zinc-400 uppercase">
            <span className="h-px w-8 bg-zinc-600" />
            Random Things
            <span className="h-px w-8 bg-zinc-600" />
          </span>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-zinc-800/70 bg-zinc-950/80 p-8 shadow-[0_22px_70px_-35px_rgba(0,0,0,0.9)] backdrop-blur">
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-emerald-500/5 blur-3xl" />
          
          <div className="relative space-y-12">
            
            {/* Header info */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-white mb-6">
                TERMS OF SERVICE
              </h1>
              
              <div className="text-sm text-zinc-400 space-y-1">
                <p>App name: <span className="text-zinc-200">Random Things</span></p>
                <p>Owner: <span className="text-zinc-200">Nguyễn Thanh Nhàn</span></p>
                <p>Domain: <a href="https://random-things-ziaz.vercel.app" className="text-emerald-400 hover:text-emerald-300 transition-colors">https://random-things-ziaz.vercel.app</a></p>
                <p>Last updated: <span className="text-zinc-200">05 Jan 2026</span></p>
              </div>
            </div>

            {/* ENGLISH SECTION */}
            <section className="space-y-6 text-zinc-300">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl font-medium text-white">Terms of Service (English)</h2>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <ul className="list-disc list-inside pl-2 space-y-3 text-zinc-400">
                  <li>
                    Random Things is provided “as is” for internal and experimental purposes.
                  </li>
                  <li>
                    The App is not intended for public commercial use.
                  </li>
                  <li>
                    The owner reserves the right to modify or discontinue the App at any time.
                  </li>
                  <li>
                    No warranties are provided regarding availability or accuracy.
                  </li>
                  <li>
                    By using this App, you agree to these terms.
                  </li>
                </ul>
              </div>
            </section>

            {/* Divider */}
            <div className="h-px bg-zinc-800" />

            {/* VIETNAMESE SECTION */}
            <section className="space-y-6 text-zinc-300">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl font-medium text-white">Điều khoản sử dụng (Tiếng Việt)</h2>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <ul className="list-disc list-inside pl-2 space-y-3 text-zinc-400">
                  <li>
                    Random Things được cung cấp dưới dạng “nguyên trạng” cho mục đích nội bộ và thử nghiệm.
                  </li>
                  <li>
                    Ứng dụng không dành cho mục đích thương mại công cộng.
                  </li>
                  <li>
                    Chủ sở hữu có quyền thay đổi hoặc ngừng ứng dụng bất kỳ lúc nào.
                  </li>
                  <li>
                    Không có cam kết về tính ổn định hay độ chính xác.
                  </li>
                  <li>
                    Việc sử dụng ứng dụng đồng nghĩa với việc bạn chấp nhận các điều khoản này.
                  </li>
                </ul>
              </div>
            </section>
            
            <div className="pt-8 text-center text-[10px] text-zinc-600">
              <p>&copy; {new Date().getFullYear()} Nguyễn Thanh Nhàn. All rights reserved.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
