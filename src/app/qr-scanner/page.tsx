'use client'

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  ChangeEvent,
  DragEvent as ReactDragEvent,
  ClipboardEventHandler,
} from 'react'
import QrScanner from 'qr-scanner'
import { translations } from '../../utils/language/language'
import LanguageSelect from '../../components/LanguageSelect'
import { CornerPoint, Language, ScanStatus } from '../../types/type'
import { cropQRFromSource } from '../../utils/cropQRFromSrc'
import CameraScan from '../../components/CameraScan'
import ImageScan from '../../components/ImageScan'
import FeatureSelect from '../../components/FeatureSelect'

export default function QrScannerPage() {
  const [language, setLanguage] = useState<Language>('vi')
  const [feature, setFeature] = useState<'camera' | 'image'>('camera')
  const t = translations[language]

  const [status, setStatus] = useState<ScanStatus>('idle')
  const [message, setMessage] = useState<string>('')
  const [decoded, setDecoded] = useState<string>('')
  const [qrOnlyUrl, setQrOnlyUrl] = useState<string>('')
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [sourceText, setSourceText] = useState('')

  const dragCounter = useRef(0)

  const reset = () => {
    setDecoded('')
    setQrOnlyUrl('')
    setMessage('')
    setStatus('idle')
  }

  const processFile = useCallback(
    async (file: File) => {
      reset()
      setStatus('scanning')
      setMessage(t.analyzing)

      const url = URL.createObjectURL(file)

      try {
        const detailed = await QrScanner.scanImage(file, {
          returnDetailedScanResult: true,
        })

        const data = detailed.data as string
        const cornerPoints = detailed.cornerPoints as CornerPoint[]

        setDecoded(data)
        setStatus('success')
        setMessage(t.found)

        const img = document.createElement('img') as HTMLImageElement
        img.onload = () => {
          try {
            const croppedDataUrl = cropQRFromSource(
              img.width,
              img.height,
              (ctx) => ctx.drawImage(img, 0, 0, img.width, img.height),
              cornerPoints
            )
            setQrOnlyUrl(croppedDataUrl)
          } catch (err) {
            console.error(err)
          }
        }
        img.src = url
      } catch (err) {
        console.error(err)
        setStatus('error')
        setMessage(t.notFound)
      }
    },
    [t]
  )

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    void processFile(file)
  }

  const handleDrop = (e: ReactDragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    setIsDragging(false)
    dragCounter.current = 0
    if (!file) return
    void processFile(file)
  }

  const handleDragOver = (e: ReactDragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleFeatureChange = (next: 'camera' | 'image') => {
    if (next === feature) return
    reset()
    setSourceText('')
    setFeature(next)
  }

  // Global drag overlay
  useEffect(() => {
    const handleWindowDragEnter = (e: DragEvent) => {
      if (!e.dataTransfer?.types?.includes('Files')) return
      e.preventDefault()
      dragCounter.current += 1
      setIsDragging(true)
    }

    const handleWindowDragOver = (e: DragEvent) => {
      if (!e.dataTransfer?.types?.includes('Files')) return
      e.preventDefault()
    }

    const handleWindowDragLeave = (e: DragEvent) => {
      if (!e.dataTransfer?.types?.includes('Files')) return
      e.preventDefault()
      dragCounter.current = Math.max(0, dragCounter.current - 1)
      if (dragCounter.current === 0) setIsDragging(false)
    }

    const handleWindowDrop = (e: DragEvent) => {
      if (!e.dataTransfer?.types?.includes('Files')) return
      e.preventDefault()
      const file = e.dataTransfer.files?.[0]
      dragCounter.current = 0
      setIsDragging(false)
      if (!file) return
      void processFile(file)
    }

    window.addEventListener('dragenter', handleWindowDragEnter)
    window.addEventListener('dragover', handleWindowDragOver)
    window.addEventListener('dragleave', handleWindowDragLeave)
    window.addEventListener('drop', handleWindowDrop)

    return () => {
      window.removeEventListener('dragenter', handleWindowDragEnter)
      window.removeEventListener('dragover', handleWindowDragOver)
      window.removeEventListener('dragleave', handleWindowDragLeave)
      window.removeEventListener('drop', handleWindowDrop)
    }
  }, [processFile])

  const copyToClipboard = async () => {
    if (!decoded) return
    await navigator.clipboard.writeText(decoded)
    setMessage(t.copied)
  }

  const openIfUrl = () => {
    if (!decoded) return
    try {
      const url = new URL(decoded)
      window.open(url.toString(), '_blank')
    } catch {
      setMessage(t.notUrl)
    }
  }

  const handlePaste: ClipboardEventHandler<HTMLTextAreaElement> = (e) => {
    const item = e.clipboardData?.files?.[0]
    if (!item) return

    if (item.type.startsWith('image')) {
      void processFile(item)
    }
  }

  const handleChangeTextarea = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault()

    const text = e.target.value
    setSourceText(text)

    try {
      const res = await fetch(text)
      const contentType = res.headers.get('content-type')

      if (contentType?.startsWith('image/')) {
        const blob = await res.blob()
        const file = new File([blob], 'qr.png', { type: contentType })

        void processFile(file)
      }
    } catch {
      setMessage(t.notUrl)
    }
  }
  const statusColor =
    status === 'success'
      ? 'text-emerald-500'
      : status === 'error'
        ? 'text-rose-500'
        : status === 'scanning'
          ? 'text-amber-500'
          : 'text-zinc-400'

  const statusLabel =
    status === 'idle'
      ? t.statusLabel.idle
      : status === 'scanning'
        ? t.statusLabel.scanning
        : status === 'success'
          ? t.statusLabel.success
          : t.statusLabel.error

  const renderFeature = () => {
    switch (feature) {
      case 'image':
        return (
          <ImageScan
            handleChangeTextarea={handleChangeTextarea}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleInputChange={handleInputChange}
            handlePaste={handlePaste}
            qrOnlyUrl={qrOnlyUrl}
            sourceText={sourceText}
            t={t}
          />
        )

      case 'camera':
        return (
          <CameraScan
            t={t}
            qrOnlyUrl={qrOnlyUrl}
            setDecoded={setDecoded}
            setMessage={setMessage}
            setQrOnlyUrl={setQrOnlyUrl}
            setStatus={setStatus}
          />
        )
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-900 via-black to-zinc-900 px-4 py-10 text-zinc-50">
      {isDragging && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 border border-dashed border-emerald-400/60 bg-emerald-500/10 backdrop-blur-[2px]" />
          <div className="relative z-10 animate-pulse rounded-2xl border border-emerald-400/70 bg-emerald-800/40 px-5 py-3 text-sm font-semibold text-emerald-50 shadow-[0_22px_70px_-30px_rgba(16,185,129,0.85)]">
            {t.overlayDrop}
          </div>
        </div>
      )}
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-10 flex flex-col gap-2 text-center">
          <div className="flex justify-between">
            <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-zinc-400 uppercase">
              <span className="h-px w-6 bg-zinc-600" />
              QR Studio
              <span className="h-px w-6 bg-zinc-600" />
            </span>
            <LanguageSelect language={language} setLanguage={setLanguage} />
          </div>
          <h1 className="text-3xl font-semibold sm:text-4xl">{t.heroTitle}</h1>
          <p className="text-sm text-zinc-400">{t.heroDesc}</p>
        </div>

        {/* <div className="flex w-40 rounded-full bg-zinc-800 p-1">
          <button
            onClick={() => setFeature('camera')}
            className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              feature === 'camera'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-zinc-400'
            }`}
          >
            Camera
          </button>
          <button
            onClick={() => setFeature('image')}
            className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              feature === 'image'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-zinc-400'
            }`}
          >
            Image
          </button>
        </div> */}

        <FeatureSelect feature={feature} setFeature={handleFeatureChange} />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)]">
          {/* LEFT: Camera + status/result */}
          <div className="space-y-4">
            {/* Camera + QR from image */}
            <div className="grid grid-cols-2 gap-4">
              {/* Left side */}
              {renderFeature()}

              {/* Right side */}
              <div className="grid grid-rows-[1fr_4fr] gap-4">
                {/* Status */}
                <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-xs">
                  <div>
                    <p className={`font-medium ${statusColor}`}>
                      {statusLabel}
                    </p>
                    {message && (
                      <p className="mt-0.5 text-[11px] text-zinc-500">
                        {message}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500/70" />
                    {t.realtime}
                  </div>
                </div>

                {/* Result text + actions */}
                <div className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
                  <p className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">
                    {t.resultCard.title}
                  </p>

                  <div className="mt-3 max-h-52 flex-1 overflow-auto rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 text-xs text-zinc-100">
                    {decoded ? (
                      decoded
                    ) : (
                      <span className="text-zinc-600">
                        {t.resultCard.empty}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      disabled={!decoded}
                      className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-[11px] font-medium text-zinc-100 shadow-sm transition hover:border-zinc-500 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {t.buttons.copy}
                    </button>

                    <button
                      type="button"
                      onClick={openIfUrl}
                      disabled={!decoded}
                      className="inline-flex items-center gap-1 rounded-full border border-emerald-600/70 bg-emerald-700/80 px-3 py-1.5 text-[11px] font-medium text-emerald-50 shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {t.buttons.openUrl}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSourceText('')
                        reset()
                      }}
                      className="ml-auto inline-flex items-center gap-1 rounded-full border border-zinc-700/80 bg-transparent px-3 py-1.5 text-[11px] font-medium text-zinc-300 shadow-sm transition hover:bg-zinc-900"
                    >
                      {t.buttons.reset}
                    </button>
                  </div>

                  <p className="mt-3 text-right text-[10px] text-zinc-500">
                    github.com/n-seiyaku
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
