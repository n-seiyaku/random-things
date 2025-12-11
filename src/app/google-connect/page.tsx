// app/google-connect/page.tsx
'use client'

export default function GoogleConnectPage() {
  const handleConnect = () => {
    // Gọi API redirect sang Google Login
    window.location.href = '/api/google/auth-url'
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="mb-2 text-2xl font-semibold">
          Kết nối Gmail để lấy Refresh Token
        </h1>
        <p className="mb-4 text-sm text-gray-600">
          Bước này chỉ cần làm <strong>một lần</strong>. Sau khi cho phép,
          Google sẽ trả về <code>refresh_token</code> để bạn dùng trong server
          đọc Gmail tự động.
        </p>

        <ol className="mb-4 list-inside list-decimal space-y-1 text-sm text-gray-700">
          <li>Bấm nút bên dưới.</li>
          <li>Đăng nhập đúng Gmail nhận OTP.</li>
          <li>Chọn “Allow”.</li>
          <li>
            Ở trang tiếp theo, copy <code>refresh_token</code>.
          </li>
        </ol>

        <button
          onClick={handleConnect}
          className="w-full rounded-xl border border-slate-900 bg-slate-900 py-2.5 font-medium text-white transition hover:bg-slate-800"
        >
          Đăng nhập Gmail để lấy refresh token
        </button>
      </div>
    </main>
  )
}
