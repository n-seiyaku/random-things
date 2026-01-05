import QrScanner from 'qr-scanner'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { CornerPoint, ScanStatus, Translations } from '../types/type'
import { cropQRFromSource } from '../utils/cropQRFromSrc'
import Image from 'next/image'

export default function CameraScan({
  t,
  qrOnlyUrl,
  setStatus,
  setMessage,
  setDecoded,
  setQrOnlyUrl,
}: {
  t: Translations
  qrOnlyUrl: string
  setStatus: Dispatch<SetStateAction<ScanStatus>>
  setMessage: Dispatch<SetStateAction<string>>
  setDecoded: Dispatch<SetStateAction<string>>
  setQrOnlyUrl: Dispatch<SetStateAction<string>>
}) {
  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [cameraType, setCameraType] = useState<'environment' | 'user'>(
    'environment'
  )
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const cameraScannerRef = useRef<QrScanner | null>(null)

  // ====== CAMERA: start/stop & crop frame khi quét được ======
  const toggleCamera = async () => {
    if (isCameraActive) {
      // tắt camera nếu đang bật
      cameraScannerRef.current?.stop()
      cameraScannerRef.current?.destroy()
      cameraScannerRef.current = null
      setIsCameraActive(false)
      return
    }

    if (!videoRef.current) return

    try {
      const scanner = new QrScanner(
        videoRef.current,
        async (result) => {
          const data = result.data as string
          const cornerPoints = result.cornerPoints as CornerPoint[] | undefined

          setDecoded(data)
          setStatus('success')
          setMessage(t.cameraFound)

          // --- CẮT QR TỪ FRAME HIỆN TẠI CỦA VIDEO ---
          if (
            videoRef.current &&
            cornerPoints &&
            cornerPoints.length >= 4 &&
            videoRef.current.videoWidth > 0
          ) {
            const video = videoRef.current
            const dataUrl = cropQRFromSource(
              video.videoWidth,
              video.videoHeight,
              (ctx) =>
                ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight),
              cornerPoints
            )
            setQrOnlyUrl(dataUrl)
          }

          // Dừng camera & destroy scanner → frame “đứng hình”
          if (cameraScannerRef.current) {
            await cameraScannerRef.current.stop()
            cameraScannerRef.current.destroy()
            cameraScannerRef.current = null
          }
          setIsCameraActive(false)
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: cameraType,
        }
      )

      cameraScannerRef.current = scanner
      await scanner.start()
      setIsCameraActive(true)
      setCameraError(null)
    } catch (err) {
      console.error(err)
      setCameraError(t.camera.error)
      setIsCameraActive(false)
    }
  }

  // Cleanup camera khi unmount
  useEffect(() => {
    return () => {
      if (cameraScannerRef.current) {
        cameraScannerRef.current.stop()
        cameraScannerRef.current.destroy()
      }
    }
  }, [])

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
      <p className="text-xs font-medium text-zinc-400">{t.camera.title}</p>

      {qrOnlyUrl ? (
        <div className="relative h-full w-full">
          <Image
            src={qrOnlyUrl}
            alt="qr-only"
            fill
            className="object-contain"
          />
        </div>
      ) : (
        <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-xl bg-zinc-900">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            muted
            playsInline
          />

          {isCameraActive && (
            <button
              type="button"
              aria-label="Đổi cam trước/sau"
              onClick={async () => {
                // Stop camera hiện tại
                cameraScannerRef.current?.stop()
                cameraScannerRef.current?.destroy()
                cameraScannerRef.current = null
                setIsCameraActive(false)

                // Đợi một chút để camera stop hoàn toàn
                await new Promise((resolve) => setTimeout(resolve, 100))

                // Thay đổi camera type
                setCameraType((type) =>
                  type === 'environment' ? 'user' : 'environment'
                )

                // Start camera mới với camera type đã thay đổi
                if (videoRef.current) {
                  try {
                    const scanner = new QrScanner(
                      videoRef.current,
                      async (result) => {
                        const data = result.data as string
                        const cornerPoints = result.cornerPoints as
                          | CornerPoint[]
                          | undefined

                        setDecoded(data)
                        setStatus('success')
                        setMessage(t.cameraFound)

                        // --- CẮT QR TỪ FRAME HIỆN TẠI CỦA VIDEO ---
                        if (
                          videoRef.current &&
                          cornerPoints &&
                          cornerPoints.length >= 4 &&
                          videoRef.current.videoWidth > 0
                        ) {
                          const video = videoRef.current
                          const dataUrl = cropQRFromSource(
                            video.videoWidth,
                            video.videoHeight,
                            (ctx) =>
                              ctx.drawImage(
                                video,
                                0,
                                0,
                                video.videoWidth,
                                video.videoHeight
                              ),
                            cornerPoints
                          )
                          setQrOnlyUrl(dataUrl)
                        }

                        // Dừng camera & destroy scanner → frame "đứng hình"
                        if (cameraScannerRef.current) {
                          await cameraScannerRef.current.stop()
                          cameraScannerRef.current.destroy()
                          cameraScannerRef.current = null
                        }
                        setIsCameraActive(false)
                      },
                      {
                        returnDetailedScanResult: true,
                        highlightScanRegion: true,
                        highlightCodeOutline: true,
                        preferredCamera: cameraType,
                      }
                    )

                    cameraScannerRef.current = scanner
                    await scanner.start()
                    setIsCameraActive(true)
                    setCameraError(null)
                  } catch (err) {
                    console.error(err)
                    setCameraError(t.camera.error)
                    setIsCameraActive(false)
                  }
                }
              }}
              className="absolute top-5 right-4 z-20 m-0 p-0 text-zinc-100 transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              {/* icon chuyển camera */}
              <span className="material-symbols-outlined flex h-9 w-9 items-center justify-center rounded-full bg-transparent p-0 text-[2rem] shadow-none">
                flip_camera_android
              </span>
            </button>
          )}

          {!isCameraActive && (
            <span className="absolute px-4 text-center text-[11px] text-zinc-500">
              {t.camera.hint}
            </span>
          )}
        </div>
      )}

      {cameraError && (
        <p className="text-[11px] text-rose-400">{t.camera.error}</p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={toggleCamera}
          className={`inline-flex items-center justify-center rounded-full border px-4 py-1.5 text-[11px] font-medium transition ${
            isCameraActive
              ? 'border-rose-500/70 bg-rose-600/80 text-rose-50 hover:bg-rose-500'
              : 'border-emerald-500/70 bg-emerald-600/80 text-emerald-50 hover:bg-emerald-500'
          }`}
        >
          {isCameraActive ? t.camera.stop : t.camera.start}
        </button>
      </div>

      <p className="text-[10px] text-zinc-500">{t.camera.note}</p>
    </div>
  )
}
