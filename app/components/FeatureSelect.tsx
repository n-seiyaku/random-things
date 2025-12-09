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

  // animate bằng gsap
  useGSAP(() => {
    if (!sliderRef.current) return

    const toImage = feature === 'image'

    gsap.to(sliderRef.current, {
      left: toImage ? 'calc(50% - 3px)' : '3px',
      duration: 0.3,
      ease: 'power3.out',
    })
  }, [feature])

  const options: Array<'camera' | 'image'> = ['camera', 'image']

  return (
    <div className="relative mb-4 flex w-44 overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900/70 p-1">
      {/* slider chạy   */}
      <div
        ref={sliderRef}
        className="absolute top-1 bottom-1 w-1/2 rounded-xl bg-emerald-600/70 shadow-lg"
      />

      {/* buttons */}
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => setFeature(opt)}
          className={`relative z-10 w-1/2 py-1.5 text-xs font-medium transition ${
            feature === opt ? 'text-white' : 'text-zinc-400'
          }`}
        >
          {opt.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
