import Link from 'next/link'

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800 bg-zinc-950/50 py-6 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-zinc-500 sm:flex-row">
        <div className="flex items-center gap-4">
          <span>&copy; {new Date().getFullYear()} Random Things</span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/privacy-policy"
            className="transition-colors hover:text-zinc-300"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="transition-colors hover:text-zinc-300"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
}
