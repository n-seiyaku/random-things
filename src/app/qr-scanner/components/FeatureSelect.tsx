'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

interface Props {
  feature: 'camera' | 'image'
  setFeature: (f: 'camera' | 'image') => void
}

export default function FeatureSelect({ feature, setFeature }: Props) {
  const sliderRef = useRef<HTMLDivElement | null>(null)

  // Animate like Header (Apple-like)
  const isInitialized = useRef(false)
  useGSAP(() => {
    if (!sliderRef.current) return

    const toImage = feature === 'image'
    const left = toImage ? 'calc(50% - 3px)' : '3px'
    const width = 'calc(50% - 0px)'

    if (!isInitialized.current) {
      gsap.set(sliderRef.current, {
        left,
        width,
        opacity: 1,
        scale: 1,
      })
      isInitialized.current = true
    } else {
      const tl = gsap.timeline()
      tl.to(sliderRef.current, {
        scale: 0.95,
        duration: 0.12,
        ease: 'power2.in',
      })
        .to(sliderRef.current, {
          left,
          width,
          scale: 1.05,
          duration: 0.24,
          ease: 'power2.out',
        })
        .to(sliderRef.current, {
          scale: 1,
          duration: 0.11,
          ease: 'power2.inOut',
        })
    }
  }, [feature])

  const options: Array<'camera' | 'image'> = ['camera', 'image']

  return (
    <div className="relative mb-4 flex w-44 overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900/70 p-1">
      {/* sliding background */}
      <div
        ref={sliderRef}
        className={`absolute top-1 bottom-1 w-1/2 rounded-xl shadow-lg transition-colors ${feature === 'camera' ? 'bg-emerald-600/70' : 'bg-rose-500/70'}`}
      />

      {/* buttons */}
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => setFeature(opt)}
          className={`relative z-10 w-1/2 py-1.5 text-xs font-medium transition-colors duration-200 ${feature === opt ? (opt === 'camera' ? 'text-emerald-200' : 'text-rose-200') : 'text-zinc-400'}`}
        >
          {opt.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
