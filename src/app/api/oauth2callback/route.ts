import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForTokens } from '@/lib/googleOAuth'
import { saveTokens } from '@/lib/tokenStore'

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

type Status = 'idle' | 'loading' | 'success' | 'error'

function buildPage({
  title,
  heading,
  badge,
  status,
  bodyHtml,
}: {
  title: string
  heading: string
  badge: string
  status: Status
  bodyHtml: string
}) {
  return `
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
      <style>
        :root {
          color-scheme: dark;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: radial-gradient(circle at top, #020617 0, #000 40%, #18181b 100%);
          background-image:
            radial-gradient(circle at 0% 0%, rgba(16,185,129,0.12), transparent 55%),
            linear-gradient(to bottom right, #020617, #000, #18181b);
          color: #e5e7eb;
        }

        .shell {
          position: relative;
          width: 100%;
          max-width: 820px;
        }

        .glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(42px);
          pointer-events: none;
          background: rgba(16,185,129,0.10);
        }

        .glow-1 {
          width: 280px;
          height: 220px;
          top: -80px;
          right: -80px;
        }

        .glow-2 {
          width: 260px;
          height: 220px;
          bottom: -90px;
          left: -40px;
        }

        .card {
          position: relative;
          padding: 26px 26px 20px;
          border-radius: 24px; /* rounded-3xl gần giống */
          background: rgba(9,9,11,0.86); /* bg-zinc-950/80 */
          border: 1px solid rgba(39,39,42,0.7); /* border-zinc-800/70 */
          backdrop-filter: blur(22px);
          box-shadow: 0 22px 70px -35px rgba(0,0,0,0.9); /* theo spec */
        }

        .card-inner {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .header-main {
          max-width: 72%;
        }

        .badge {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.2em; /* tracking-[0.2em] */
          color: #a1a1aa;
          margin-bottom: 6px;
        }

        .badge span {
          opacity: 0.9;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          background: rgba(24,24,27,0.95);
          border: 1px solid rgba(39,39,42,0.9); /* zinc */
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
        }

        .status-idle {
          background: #a1a1aa; /* zinc-400 */
        }

        .status-loading {
          background: #fbbf24; /* amber-400 */
        }

        .status-success {
          background: #4ade80; /* emerald-400 */
          box-shadow: 0 0 18px rgba(52,211,153,0.7);
        }

        .status-error {
          background: #fb7185; /* rose-400 */
          box-shadow: 0 0 18px rgba(248,113,113,0.7);
        }

        h1 {
          margin: 0;
          font-size: 1.75rem; /* ~text-3xl */
          font-weight: 600;
          letter-spacing: -0.03em; /* tracking-tight */
          color: #f9fafb; /* text-zinc-50 */
        }

        .subtitle {
          margin-top: 8px;
          font-size: 12px; /* text-xs */
          line-height: 1.7;
          color: #9ca3af; /* text-zinc-400-ish */
        }

        code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 12px;
        }

        .section-title {
          margin-top: 12px;
          margin-bottom: 6px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #6b7280;
        }

        .token-block {
          margin: 0;
          padding: 12px 14px;
          border-radius: 18px;
          background: rgba(2,6,23,0.96); /* dark navy */
          border: 1px solid rgba(39,39,42,0.9);
          color: #e5e7eb;
          white-space: pre-wrap;
          word-break: break-all;
          font-size: 12px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }

        .token-block.primary {
          border-color: rgba(16,185,129,0.75);
          box-shadow:
            0 0 30px rgba(16,185,129,0.65),
            0 18px 60px rgba(0,0,0,0.95);
        }

        .token-block.secondary {
          opacity: 0.95;
        }

        .footnote {
          margin-top: 14px;
          font-size: 12px;
          line-height: 1.7;
          color: #6b7280;
        }

        .error-text {
          color: #fecaca;
        }

        .error-pre {
          margin-top: 6px;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(15,23,42,0.98);
          border: 1px solid rgba(248,113,113,0.7);
          color: #fee2e2;
          font-size: 12px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          white-space: pre-wrap;
        }

        .button-row {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 7px 16px;
          border-radius: 999px; /* pill */
          font-size: 12px;
          font-weight: 500;
          text-decoration: none;
          border-width: 1px;
          border-style: solid;
          cursor: pointer;
        }

        .btn-primary {
          background: radial-gradient(circle at 0 0, rgba(52,211,153,0.24), rgba(16,185,129,0.12));
          border-color: rgba(52,211,153,0.8);
          color: #ecfdf5;
          box-shadow:
            0 0 30px rgba(16,185,129,0.7),
            0 22px 70px -35px rgba(0,0,0,0.9);
        }

        .btn-secondary {
          background: rgba(24,24,27,0.95);
          border-color: rgba(39,39,42,0.9);
          color: #e5e7eb;
          box-shadow: 0 22px 70px -35px rgba(0,0,0,0.9);
        }

        .btn span.dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #4ade80;
          box-shadow: 0 0 10px rgba(74,222,128,0.9);
        }

        /* OTP display style để dùng sau (theo spec của bạn) */
        .otp-display {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 2.25rem; /* text-4xl */
          letter-spacing: 0.35em;
          text-align: center;
          color: #a7f3d0;
        }

        @media (max-width: 640px) {
          body {
            padding: 16px;
          }
          .card {
            padding: 20px 18px 16px;
          }
          .header-main {
            max-width: 100%;
          }
          .header-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      </style>
    </head>
    <body>
      <div class="shell">
        <div class="glow glow-1"></div>
        <div class="glow glow-2"></div>
        <div class="card">
          <div class="card-inner">
            <div class="header-row">
              <div class="header-main">
                <div class="badge"><span>${badge}</span></div>
                <h1>${heading}</h1>
                <!-- bodyHtml sẽ render phần mô tả chính -->
              </div>
              <div class="status-pill">
                <span class="status-dot status-${status}"></span>
                <span>${status.toUpperCase()}</span>
              </div>
            </div>

            ${bodyHtml}
          </div>
        </div>
      </div>
    </body>
  </html>
  `
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')

  if (error) {
    const safeError = escapeHtml(error)
    const html = buildPage({
      title: 'Google OAuth error',
      heading: 'Có lỗi khi xác thực với Google',
      badge: 'Gmail OAuth · Error',
      status: 'error',
      bodyHtml: `
        <p class="subtitle error-text">
          Google trả về một lỗi trong quá trình OAuth. Bạn có thể kiểm tra lại cấu hình OAuth Client
          (redirect URI, scope, loại client, v.v.).
        </p>

        <div class="section-title">Chi tiết lỗi</div>
        <div class="error-pre">${safeError}</div>

        <div class="button-row">
          <a class="btn btn-secondary" href="/google-connect">
            Quay lại /google-connect
          </a>
        </div>
      `,
    })

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  }

  if (!code) {
    const html = buildPage({
      title: 'No OAuth code',
      heading: 'Không tìm thấy mã xác thực (code)',
      badge: 'Gmail OAuth · Idle',
      status: 'idle',
      bodyHtml: `
        <p class="subtitle">
          Không thấy query param <code>code</code> trong URL. Có thể bạn đã mở trực tiếp link callback,
          hoặc tab này không phải do Google redirect về.
        </p>

        <div class="section-title">Cách thực hiện đúng</div>
        <p class="subtitle">
          Hãy quay lại trang <code>/google-connect</code>, bấm nút đăng nhập Gmail và để Google redirect về đây tự động.
        </p>

        <div class="button-row">
          <a class="btn btn-primary" href="/google-connect">
            <span class="dot"></span>
            Quay lại /google-connect
          </a>
        </div>
      `,
    })

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  }

  try {
    const tokens = await exchangeCodeForTokens(code)

    const refreshToken = tokens.refresh_token ?? '(khong co refresh_token)'
    const accessToken = tokens.access_token ?? '(khong co access_token)'
    const expiresAt =
      typeof tokens.expiry_date === 'number' ? tokens.expiry_date : null

    let saveStatus = 'success'
    let saveMessage = 'Token đã được cập nhật thành công trên Neon database.'
    
    try {
      await saveTokens({
        refreshToken: tokens.refresh_token ?? null,
        accessToken: tokens.access_token ?? null,
        expiresAt,
      })
      console.log('[oauth2callback] Tokens saved/updated to Neon successfully')
    } catch (persistErr) {
      console.error('[oauth2callback] Save tokens to Neon failed:', persistErr)
      saveStatus = 'warning'
      const errorMsg = persistErr instanceof Error ? persistErr.message : String(persistErr)
      saveMessage = `Cảnh báo: Không thể lưu token vào Neon database. Lỗi: ${escapeHtml(errorMsg)}`
    }

    const safeRefreshToken = escapeHtml(refreshToken)
    const safeAccessToken = escapeHtml(accessToken)
    const safeSaveMessage = escapeHtml(saveMessage)

    const html = buildPage({
      title: 'Gmail OAuth Tokens',
      heading: '✅ Lấy token thành công',
      badge: 'Gmail OAuth · Tokens',
      status: 'success',
      bodyHtml: `
        <p class="subtitle">
          Token đã được lấy thành công từ Google. ${saveStatus === 'success' ? 'Token đã được cập nhật vào Neon database.' : ''}
        </p>

        ${saveStatus === 'warning' ? `
          <div class="error-pre" style="margin-bottom: 18px;">
            ⚠️ ${safeSaveMessage}
          </div>
        ` : ''}

        <div class="section-title">REFRESH TOKEN</div>
        <pre class="token-block primary">${safeRefreshToken}</pre>

        <div class="section-title">ACCESS TOKEN (thông tin thêm)</div>
        <pre class="token-block secondary">${safeAccessToken}</pre>

        <div class="button-row">
          <a class="btn btn-secondary" href="/google-connect">
            Quay lại /google-connect
          </a>
        </div>
      `,
    })

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (e: unknown) {
    console.error('Error exchanging code:', e)
    const errorMessage = e instanceof Error ? e.message : String(e)
    const safeError = escapeHtml(errorMessage)

    const html = buildPage({
      title: 'OAuth exchange error',
      heading: 'Lỗi khi đổi code sang tokens',
      badge: 'Gmail OAuth · Error',
      status: 'error',
      bodyHtml: `
        <p class="subtitle error-text">
          Có lỗi xảy ra khi gọi API Google để đổi <code>code</code> sang access/refresh token.
        </p>

        <div class="section-title">Chi tiết lỗi</div>
        <div class="error-pre">${safeError}</div>

        <p class="footnote">
          Hãy kiểm tra lại:
          <br />• <code>GOOGLE_CLIENT_ID</code>, <code>GOOGLE_CLIENT_SECRET</code>
          <br />• <code>GOOGLE_REDIRECT_URI</code> trùng với cấu hình trên Google Cloud Console
          <br />• Scope và loại OAuth client (Web application)
        </p>

        <div class="button-row">
          <a class="btn btn-secondary" href="/google-connect">
            Quay lại /google-connect
          </a>
        </div>
      `,
    })

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
      status: 500,
    })
  }
}
