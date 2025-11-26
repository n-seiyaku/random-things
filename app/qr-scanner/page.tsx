"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  ChangeEvent,
  DragEvent as ReactDragEvent,
} from "react";
import NextImage from "next/image";
import QrScanner from "qr-scanner";
import { Language, translations } from "../language/language";
import LanguageSelect from "../components/LanguageSelect";

type CornerPoint = { x: number; y: number };
type ScanStatus = "idle" | "scanning" | "success" | "error";

function cropQrFromSource(
  sourceWidth: number,
  sourceHeight: number,
  drawSource: (ctx: CanvasRenderingContext2D) => void,
  corners: CornerPoint[],
  padding = 50
): string {
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = sourceWidth;
  sourceCanvas.height = sourceHeight;
  const sourceCtx = sourceCanvas.getContext("2d");
  if (!sourceCtx) throw new Error("Không lấy được 2d context");
  drawSource(sourceCtx);

  const xs = corners.map((p) => p.x);
  const ys = corners.map((p) => p.y);

  let minX = Math.floor(Math.min(...xs));
  let maxX = Math.ceil(Math.max(...xs));
  let minY = Math.floor(Math.min(...ys));
  let maxY = Math.ceil(Math.max(...ys));

  minX = Math.max(0, minX);
  minY = Math.max(0, minY);
  maxX = Math.min(sourceCanvas.width, maxX);
  maxY = Math.min(sourceCanvas.height, maxY);

  const width = maxX - minX;
  const height = maxY - minY;

  const cropCanvas = document.createElement("canvas");
  cropCanvas.width = width + padding * 2;
  cropCanvas.height = height + padding * 2;
  const cropCtx = cropCanvas.getContext("2d");
  if (!cropCtx) throw new Error("Không lấy được 2d context");

  cropCtx.fillStyle = "#fff";
  cropCtx.fillRect(0, 0, cropCanvas.width, cropCanvas.height);

  cropCtx.drawImage(
    sourceCanvas,
    minX,
    minY,
    width,
    height,
    padding,
    padding,
    width,
    height
  );

  return cropCanvas.toDataURL("image/png");
}

export default function QrScannerPage() {
  const [language, setLanguage] = useState<Language>("vi");
  const t = translations[language];

  const [status, setStatus] = useState<ScanStatus>("idle");
  const [message, setMessage] = useState<string>("");
  const [decoded, setDecoded] = useState<string>("");
  const [qrOnlyUrl, setQrOnlyUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraScannerRef = useRef<QrScanner | null>(null);

  const dragCounter = useRef(0);

  const reset = () => {
    setDecoded("");
    setQrOnlyUrl("");
    setMessage("");
    setStatus("idle");
  };

  const processFile = useCallback(
    async (file: File) => {
      reset();
      setStatus("scanning");
      setMessage(t.analyzing);

      const url = URL.createObjectURL(file);

      try {
        const detailed = await QrScanner.scanImage(file, {
          returnDetailedScanResult: true,
        });

        const data = detailed.data as string;
        const cornerPoints = detailed.cornerPoints as CornerPoint[];

        setDecoded(data);
        setStatus("success");
        setMessage(t.found);

        const img = document.createElement("img") as HTMLImageElement;
        img.onload = () => {
          try {
            const croppedDataUrl = cropQrFromSource(
              img.width,
              img.height,
              (ctx) => ctx.drawImage(img, 0, 0, img.width, img.height),
              cornerPoints
            );
            setQrOnlyUrl(croppedDataUrl);
          } catch (err) {
            console.error(err);
          }
        };
        img.src = url;
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage(t.notFound);
      }
    },
    [t]
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    void processFile(file);
  };

  const handleDrop = (e: ReactDragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    setIsDragging(false);
    dragCounter.current = 0;
    if (!file) return;
    void processFile(file);
  };

  const handleDragOver = (e: ReactDragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Global drag overlay
  useEffect(() => {
    const handleWindowDragEnter = (e: DragEvent) => {
      if (!e.dataTransfer?.types?.includes("Files")) return;
      e.preventDefault();
      dragCounter.current += 1;
      setIsDragging(true);
    };

    const handleWindowDragOver = (e: DragEvent) => {
      if (!e.dataTransfer?.types?.includes("Files")) return;
      e.preventDefault();
    };

    const handleWindowDragLeave = (e: DragEvent) => {
      if (!e.dataTransfer?.types?.includes("Files")) return;
      e.preventDefault();
      dragCounter.current = Math.max(0, dragCounter.current - 1);
      if (dragCounter.current === 0) setIsDragging(false);
    };

    const handleWindowDrop = (e: DragEvent) => {
      if (!e.dataTransfer?.types?.includes("Files")) return;
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      dragCounter.current = 0;
      setIsDragging(false);
      if (!file) return;
      void processFile(file);
    };

    window.addEventListener("dragenter", handleWindowDragEnter);
    window.addEventListener("dragover", handleWindowDragOver);
    window.addEventListener("dragleave", handleWindowDragLeave);
    window.addEventListener("drop", handleWindowDrop);

    return () => {
      window.removeEventListener("dragenter", handleWindowDragEnter);
      window.removeEventListener("dragover", handleWindowDragOver);
      window.removeEventListener("dragleave", handleWindowDragLeave);
      window.removeEventListener("drop", handleWindowDrop);
    };
  }, [processFile]);

  // ====== CAMERA: start/stop & crop frame khi quét được ======
  const toggleCamera = async () => {
    if (isCameraActive) {
      // tắt camera nếu đang bật
      cameraScannerRef.current?.stop();
      cameraScannerRef.current?.destroy();
      cameraScannerRef.current = null;
      setIsCameraActive(false);
      return;
    }

    if (!videoRef.current) return;

    try {
      const scanner = new QrScanner(
        videoRef.current,
        async (result) => {
          const data = result.data as string;
          const cornerPoints = result.cornerPoints as CornerPoint[] | undefined;

          setDecoded(data);
          setStatus("success");
          setMessage(t.cameraFound);

          // --- CẮT QR TỪ FRAME HIỆN TẠI CỦA VIDEO ---
          if (
            videoRef.current &&
            cornerPoints &&
            cornerPoints.length >= 4 &&
            videoRef.current.videoWidth > 0
          ) {
            const video = videoRef.current;
            const dataUrl = cropQrFromSource(
              video.videoWidth,
              video.videoHeight,
              (ctx) =>
                ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight),
              cornerPoints
            );
            setQrOnlyUrl(dataUrl);
          }

          // Dừng camera & destroy scanner → frame “đứng hình”
          if (cameraScannerRef.current) {
            await cameraScannerRef.current.stop();
            cameraScannerRef.current.destroy();
            cameraScannerRef.current = null;
          }
          setIsCameraActive(false);
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: "environment",
        }
      );

      cameraScannerRef.current = scanner;
      await scanner.start();
      setIsCameraActive(true);
      setCameraError(null);
    } catch (err) {
      console.error(err);
      setCameraError(t.camera.error);
      setIsCameraActive(false);
    }
  };

  // Cleanup camera khi unmount
  useEffect(() => {
    return () => {
      if (cameraScannerRef.current) {
        cameraScannerRef.current.stop();
        cameraScannerRef.current.destroy();
      }
    };
  }, []);

  const copyToClipboard = async () => {
    if (!decoded) return;
    await navigator.clipboard.writeText(decoded);
    setMessage(t.copied);
  };

  const openIfUrl = () => {
    if (!decoded) return;
    try {
      const url = new URL(decoded);
      window.open(url.toString(), "_blank");
    } catch {
      setMessage(t.notUrl);
    }
  };

  const statusColor =
    status === "success"
      ? "text-emerald-500"
      : status === "error"
      ? "text-rose-500"
      : status === "scanning"
      ? "text-amber-500"
      : "text-zinc-400";

  const statusLabel =
    status === "idle"
      ? t.statusLabel.idle
      : status === "scanning"
      ? t.statusLabel.scanning
      : status === "success"
      ? t.statusLabel.success
      : t.statusLabel.error;

  return (
    <div className="relative min-h-screen bg-linear-to-br from-zinc-900 via-black to-zinc-900 text-zinc-50 flex items-center justify-center px-4 py-10">
      {isDragging && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 border border-dashed border-emerald-400/60 bg-emerald-500/10 backdrop-blur-[2px]" />
          <div className="relative z-10 rounded-2xl border border-emerald-400/70 bg-emerald-800/40 px-5 py-3 text-sm font-semibold text-emerald-50 shadow-[0_22px_70px_-30px_rgba(16,185,129,0.85)] animate-pulse">
            {t.overlayDrop}
          </div>
        </div>
      )}
      <div className="w-full max-w-5xl mx-auto">
        <div className="mb-10 flex flex-col gap-2 text-center">
          <div className="flex justify-between">
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
              <span className="h-px w-6 bg-zinc-600" />
              QR Studio
              <span className="h-px w-6 bg-zinc-600" />
            </span>
            <LanguageSelect language={language} setLanguage={setLanguage} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold">{t.heroTitle}</h1>
          <p className="text-sm text-zinc-400">{t.heroDesc}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)]">
          {/* LEFT: Status + camera + upload */}
          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-xs">
              <div>
                <p className={`font-medium ${statusColor}`}>{statusLabel}</p>
                {message && (
                  <p className="mt-0.5 text-[11px] text-zinc-500">{message}</p>
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500/70 animate-pulse" />
                {t.realtime}
              </div>
            </div>

            {/* Camera + QR from image */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 flex flex-col gap-3">
                <p className="text-xs font-medium text-zinc-400">
                  {t.camera.title}
                </p>

                <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-xl bg-zinc-900">
                  <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    playsInline
                  />
                  {!isCameraActive && (
                    <span className="absolute text-[11px] text-zinc-500 px-4 text-center">
                      {t.camera.hint}
                    </span>
                  )}
                </div>

                {cameraError && (
                  <p className="text-[11px] text-rose-400">{t.camera.error}</p>
                )}

                <button
                  type="button"
                  onClick={toggleCamera}
                  className={`inline-flex items-center justify-center rounded-full px-4 py-1.5 text-[11px] font-medium transition border ${
                    isCameraActive
                      ? "border-rose-500/70 bg-rose-600/80 text-rose-50 hover:bg-rose-500"
                      : "border-emerald-500/70 bg-emerald-600/80 text-emerald-50 hover:bg-emerald-500"
                  }`}
                >
                  {isCameraActive ? t.camera.stop : t.camera.start}
                </button>

                <p className="text-[10px] text-zinc-500">{t.camera.note}</p>
              </div>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 overflow-hidden"
              >
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-[0.18em]">
                  {t.uploadCard.title}
                </p>

                <div className="mt-2 h-full flex items-center justify-center overflow-hidden rounded-xl bg-zinc-900 border border-dashed border-zinc-700/70 hover:border-zinc-500 transition">
                  {qrOnlyUrl ? (
                    <div className="relative h-full w-full">
                      <NextImage
                        src={qrOnlyUrl}
                        alt="qr-only"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1 text-center px-4">
                      <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/80">
                        <span className="text-lg">{t.uploadCard.icon}</span>
                      </div>
                      <p className="text-xs font-medium text-zinc-100">
                        {t.uploadCard.placeholderTitle}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        {t.uploadCard.placeholderSub}
                      </p>
                    </div>
                  )}
                </div>

                {/* input file phủ card */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>
            </div>
          </div>

          {/* Result text + actions */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 flex flex-col">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-[0.18em]">
              {t.resultCard.title}
            </p>

            <div className="mt-3 flex-1 rounded-xl bg-zinc-900/90 border border-zinc-800 p-3 text-xs text-zinc-100 overflow-auto max-h-52">
              {decoded ? (
                decoded
              ) : (
                <span className="text-zinc-600">{t.resultCard.empty}</span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={copyToClipboard}
                disabled={!decoded}
                className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 font-medium text-[11px] text-zinc-100 shadow-sm transition hover:border-zinc-500 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t.buttons.copy}
              </button>

              <button
                type="button"
                onClick={openIfUrl}
                disabled={!decoded}
                className="inline-flex items-center gap-1 rounded-full border border-emerald-600/70 bg-emerald-700/80 px-3 py-1.5 font-medium text-[11px] text-emerald-50 shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t.buttons.openUrl}
              </button>

              <button
                type="button"
                onClick={reset}
                className="ml-auto inline-flex items-center gap-1 rounded-full border border-zinc-700/80 bg-transparent px-3 py-1.5 font-medium text-[11px] text-zinc-300 shadow-sm transition hover:bg-zinc-900"
              >
                {t.buttons.reset}
              </button>
            </div>

            <p className="mt-3 text-[10px] text-zinc-500 text-right">
              github.com/n-seiyaku
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
