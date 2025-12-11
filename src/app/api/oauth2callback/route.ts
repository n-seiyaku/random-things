// app/api/oauth2callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForTokens } from '@/lib/googleOAuth'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')

  if (error) {
    return new NextResponse(
      `<html><body>
        <h1>Google OAuth error</h1>
        <p>${error}</p>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  if (!code) {
    return new NextResponse(
      `<html><body>
        <h1>No code found</h1>
        <p>Không thấy query param <code>code</code>. Bạn có mở nhầm URL không?</p>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  try {
    const tokens = await exchangeCodeForTokens(code)

    const refreshToken = tokens.refresh_token ?? '(không có refresh_token)'
    const accessToken = tokens.access_token ?? '(không có access_token)'

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Gmail OAuth Tokens</title>
          <style>
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              padding: 24px;
              background: #f3f4f6;
            }
            .card {
              max-width: 720px;
              margin: 0 auto;
              background: white;
              border-radius: 16px;
              padding: 24px;
              box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15);
            }
            pre {
              white-space: pre-wrap;
              word-break: break-all;
              background: #0f172a;
              color: #e5e7eb;
              padding: 12px;
              border-radius: 8px;
              font-size: 13px;
            }
            code {
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            }
            h1 {
              margin-bottom: 8px;
            }
            .label {
              font-weight: 600;
              margin-top: 16px;
              margin-bottom: 4px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>✅ Lấy token thành công</h1>
            <p>Hãy copy <strong>refresh_token</strong> bên dưới và dán vào file <code>.env.local</code>.</p>

            <div class="label">REFRESH TOKEN:</div>
            <pre>${refreshToken}</pre>

            <div class="label">ACCESS TOKEN (thông tin thêm):</div>
            <pre>${accessToken}</pre>

            <p style="margin-top:16px;font-size:14px;color:#6b7280;">
              Sau khi copy xong, bạn có thể tắt tab này.  
              Đừng commit file <code>.env.local</code> lên Git nhé 😁
            </p>
          </div>
        </body>
      </html>
    `

    return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
  } catch (e: unknown) {
    console.error('Error exchanging code:', e)
    const errorMessage = e instanceof Error ? e.message : String(e)
    return new NextResponse(
      `<html><body>
        <h1>Lỗi khi đổi code sang tokens</h1>
        <pre>${errorMessage}</pre>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' }, status: 500 }
    )
  }
}
