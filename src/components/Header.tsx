'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useLoading } from './LoadingProvider'

export function Header() {
  const pathname = usePathname()
  const { setLoading } = useLoading()
  const navRef = useRef<HTMLElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map())
  const [isInitialized, setIsInitialized] = useState(false)
  const [pendingPath, setPendingPath] = useState<string | null>(null)

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/qr-scanner', label: 'QR Scanner' },
    { href: '/code-fetcher', label: 'Code Fetcher' },
  ]

  const animateToTab = (targetPath: string) => {
    if (!navRef.current || !indicatorRef.current) return

    const targetItem = itemRefs.current.get(targetPath)
    if (!targetItem) return

    const navRect = navRef.current.getBoundingClientRect()
    const itemRect = targetItem.getBoundingClientRect()

    const x = itemRect.left - navRect.left
    const width = itemRect.width

    if (!isInitialized) {
      // Initial setup - set position without animation
      gsap.set(indicatorRef.current, {
        x,
        width,
        opacity: 1,
        scale: 1,
      })
      setIsInitialized(true)
    } else {
      // Animate to new position with scale effect (Apple-like)
      const tl = gsap.timeline()

      // Slight scale down and move
      tl.to(indicatorRef.current, {
        scale: 0.95,
        duration: 0.15,
        ease: 'power2.in',
      })
        // Move and scale up
        .to(indicatorRef.current, {
          x,
          width,
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out',
        })
        // Settle to normal scale
        .to(indicatorRef.current, {
          scale: 1,
          duration: 0.15,
          ease: 'power2.inOut',
        })
    }
  }

  // Animate when pathname changes (after route loads)
  useEffect(() => {
    if (pathname) {
      animateToTab(pathname)
      setPendingPath(null) // Clear pending when route loads
    }
  }, [pathname, isInitialized])

  // Handle click - animate immediately
  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    if (href === pathname) return // Already on this page

    setPendingPath(href)
    animateToTab(href) // Start animation immediately
    setLoading(true) // Show skeleton loading
  }

  const setItemRef = (href: string, element: HTMLElement | null) => {
    if (element) {
      itemRefs.current.set(href, element)
    } else {
      itemRefs.current.delete(href)
    }
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-zinc-800/70 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-zinc-400 uppercase transition hover:text-emerald-400"
        >
          <span className="h-px w-6 bg-zinc-600" />
          Random Things Studio
          <span className="h-px w-6 bg-zinc-600" />
        </Link>

        <nav ref={navRef} className="relative flex items-center gap-1">
          {/* Animated indicator */}
          <div
            ref={indicatorRef}
            className="absolute top-0 left-0 h-full origin-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30"
            style={{ opacity: 0, transformOrigin: 'center' }}
          />

          {navItems.map((item) => {
            const isActive = pathname === item.href
            const isPending = pendingPath === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                ref={(el) => setItemRef(item.href, el)}
                onClick={(e) => handleLinkClick(item.href, e)}
                className={`relative z-10 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive || isPending
                    ? 'text-emerald-300'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
