import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Random Things',
  description: 'Privacy Policy for Random Things app',
}

export default function PrivacyPolicyPage() {
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
                PRIVACY POLICY
              </h1>
              
              <div className="text-sm text-zinc-400 space-y-1">
                <p>App name: <span className="text-zinc-200">Random Things</span></p>
                <p>Owner: <span className="text-zinc-200">Nguyễn Thanh Nhàn</span></p>
                <p>Domain: <a href="https://www.nhannt.io.vn" className="text-emerald-400 hover:text-emerald-300 transition-colors">https://www.nhannt.io.vn</a></p>
                <p>Contact: <a href="mailto:nhannt.gm@gmail.com" className="text-emerald-400 hover:text-emerald-300 transition-colors">nhannt.gm@gmail.com</a></p>
                <p>Last updated: <span className="text-zinc-200">05 Jan 2026</span></p>
              </div>
            </div>

            {/* ENGLISH SECTION */}
            <section className="space-y-6 text-zinc-300">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl font-medium text-white">Privacy Policy (English)</h2>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-zinc-100">1. Introduction</h3>
                  <p>
                    Random Things (“the App”) is a web application developed and operated by Nguyễn Thanh Nhàn.
                    This Privacy Policy explains how information is collected, used, and protected when using the App.
                  </p>
                  <p>
                    The App is primarily an internal tool used by the owner and a small trusted group. End users are not required to log in.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-zinc-100">2. Information We Collect</h3>
                  <p>The App uses Google OAuth 2.0 for authentication only for the app owner.</p>
                  <p>When the owner logs in via Google, the App may access:</p>
                  <ul className="list-disc list-inside pl-2 space-y-1 text-zinc-400">
                    <li>Basic profile information (name, profile picture)</li>
                    <li>Email address</li>
                    <li>Google Gmail data</li>
                    <li>Google Drive data</li>
                  </ul>
                  <p className="border-l-2 border-emerald-500/50 pl-3 italic text-zinc-400 mt-2">
                    ⚠️ No personal data of general users is collected, as users do not log in.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-zinc-100">3. Use of Information</h3>
                  <p>Collected information is used solely for:</p>
                  <ul className="list-disc list-inside pl-2 space-y-1 text-zinc-400">
                    <li>Authenticating the app owner</li>
                    <li>Enabling internal features that require Gmail or Google Drive access</li>
                    <li>Operating and maintaining the App</li>
                  </ul>
                  <p>Data is not used for advertising, analytics, or marketing purposes.</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-zinc-100">4. Data Storage</h3>
                  <ul className="list-disc list-inside pl-2 space-y-1 text-zinc-400">
                    <li>OAuth tokens are securely stored in a private database hosted on Neon (PostgreSQL).</li>
                    <li>Data is accessible only by the app owner.</li>
                    <li>No data is shared with third parties.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-zinc-100">5. Data Sharing</h3>
                  <p>We do not sell, rent, or share data with any third party.</p>
                  <p>The App does not use:</p>
                  <ul className="list-disc list-inside pl-2 space-y-1 text-zinc-400">
                    <li>Google Analytics</li>
                    <li>Tracking services</li>
                    <li>Advertising networks</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-zinc-100">6. Cookies</h3>
                  <p>The App does not use cookies or tracking technologies.</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-zinc-100">7. Data Security</h3>
                  <p>We implement reasonable technical measures to protect stored data, including:</p>
                  <ul className="list-disc list-inside pl-2 space-y-1 text-zinc-400">
                    <li>Secure environment variables</li>
                    <li>Restricted database access</li>
                    <li>HTTPS encryption</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-zinc-100">8. User Rights</h3>
                  <p>Since the App does not collect data from public users, there are no user accounts or personal data to manage.</p>
                  <p>The app owner may revoke Google OAuth access at any time via their Google Account settings.</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-zinc-100">9. Changes to This Policy</h3>
                  <p>This Privacy Policy may be updated occasionally. Changes will be reflected on this page.</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-zinc-100">10. Contact</h3>
                  <p>If you have any questions about this Privacy Policy, please contact:</p>
                  <p>📧 <a href="mailto:nhannt.gm@gmail.com" className="text-emerald-400 hover:text-emerald-300">nhannt.gm@gmail.com</a></p>
                </div>
              </div>
            </section>

            {/* Divider */}
            <div className="h-px bg-zinc-800" />

            {/* VIETNAMESE SECTION */}
            <section className="space-y-6 text-zinc-300">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl font-medium text-white">Chính sách Quyền riêng tư (Tiếng Việt)</h2>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-zinc-100">1. Giới thiệu</h3>
                  <p>
                    Random Things là một ứng dụng web do Nguyễn Thanh Nhàn phát triển và vận hành.
                  </p>
                  <p>
                    Ứng dụng chủ yếu là công cụ nội bộ, chỉ dành cho chủ sở hữu và một nhóm nhỏ.
                    Người dùng thông thường không cần đăng nhập.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-zinc-100">2. Thông tin được thu thập</h3>
                  <p>Ứng dụng sử dụng Google OAuth 2.0 chỉ để đăng nhập cho chủ sở hữu ứng dụng.</p>
                  <p>Khi chủ sở hữu đăng nhập bằng Google, ứng dụng có thể truy cập:</p>
                  <ul className="list-disc list-inside pl-2 space-y-1 text-zinc-400">
                    <li>Thông tin hồ sơ cơ bản (tên, ảnh đại diện)</li>
                    <li>Địa chỉ email</li>
                    <li>Dữ liệu Gmail</li>
                    <li>Dữ liệu Google Drive</li>
                  </ul>
                  <p className="border-l-2 border-emerald-500/50 pl-3 italic text-zinc-400 mt-2">
                    ⚠️ Ứng dụng không thu thập dữ liệu cá nhân của người dùng công cộng.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-zinc-100">3. Mục đích sử dụng dữ liệu</h3>
                  <p>Dữ liệu chỉ được dùng để:</p>
                  <ul className="list-disc list-inside pl-2 space-y-1 text-zinc-400">
                    <li>Xác thực chủ sở hữu ứng dụng</li>
                    <li>Phục vụ các chức năng nội bộ liên quan đến Gmail và Google Drive</li>
                    <li>Vận hành và bảo trì ứng dụng</li>
                  </ul>
                  <p>Không sử dụng cho quảng cáo hay theo dõi.</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-zinc-100">4. Lưu trữ dữ liệu</h3>
                  <ul className="list-disc list-inside pl-2 space-y-1 text-zinc-400">
                    <li>Token OAuth được lưu trữ an toàn trong cơ sở dữ liệu Neon (PostgreSQL).</li>
                    <li>Chỉ chủ sở hữu ứng dụng có quyền truy cập.</li>
                    <li>Không chia sẻ dữ liệu cho bên thứ ba.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-zinc-100">5. Chia sẻ dữ liệu</h3>
                  <p>Ứng dụng không chia sẻ, không bán, không cho thuê dữ liệu.</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-zinc-100">6. Cookie</h3>
                  <p>Ứng dụng không sử dụng cookie hay công nghệ theo dõi.</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-zinc-100">7. Bảo mật</h3>
                  <p>Áp dụng các biện pháp bảo mật hợp lý như:</p>
                  <ul className="list-disc list-inside pl-2 space-y-1 text-zinc-400">
                    <li>Biến môi trường bảo mật</li>
                    <li>Giới hạn truy cập database</li>
                    <li>Kết nối HTTPS</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-zinc-100">8. Quyền người dùng</h3>
                  <p>Do không thu thập dữ liệu người dùng công cộng, nên không có tài khoản người dùng để quản lý.</p>
                  <p>Chủ sở hữu có thể thu hồi quyền OAuth bất kỳ lúc nào trong cài đặt Google Account.</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-zinc-100">9. Thay đổi chính sách</h3>
                  <p>Chính sách có thể được cập nhật và sẽ hiển thị tại trang này.</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-zinc-100">10. Liên hệ</h3>
                  <p>Mọi thắc mắc vui lòng liên hệ:</p>
                  <p>📧 <a href="mailto:nhannt.gm@gmail.com" className="text-emerald-400 hover:text-emerald-300">nhannt.gm@gmail.com</a></p>
                </div>
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
