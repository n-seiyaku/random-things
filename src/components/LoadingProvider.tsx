'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { PageSkeleton } from './PageSkeleton'

type LoadingContextType = {
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Reset loading when pathname changes (route loaded)
    setIsLoading(false)
  }, [pathname])

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading: setIsLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-30 bg-zinc-950/90 backdrop-blur-sm">
          <PageSkeleton />
        </div>
      )}
    </LoadingContext.Provider>
  )
}
