import NextImage from 'next/image'
import {
  ChangeEvent,
  ClipboardEventHandler,
  DragEvent as ReactDragEvent,
} from 'react'
import { Translations } from '@/types/type'

type ImageScanProps = {
  qrOnlyUrl: string
  sourceText: string
  t: Translations
  handleDrop: (e: ReactDragEvent<HTMLDivElement>) => void
  handleDragOver: (e: ReactDragEvent<HTMLDivElement>) => void
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void
  handlePaste: ClipboardEventHandler<HTMLTextAreaElement>
  handleChangeTextarea: (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => void | Promise<void>
}

export default function ImageScan({
  qrOnlyUrl,
  sourceText,
  t,
  handleDrop,
  handleDragOver,
  handleInputChange,
  handlePaste,
  handleChangeTextarea,
}: ImageScanProps) {
  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4"
    >
      <p className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase">
        {t.uploadCard.title}
      </p>

      <div className="mt-2 flex h-80 items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-700/70 bg-zinc-900 transition hover:border-zinc-500">
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
          <div className="flex flex-col items-center justify-center gap-1 px-4 text-center">
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

      <input
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="absolute inset-0 h-72 w-full cursor-pointer opacity-0"
      />
      <textarea
        className="mt-4 w-full resize-none overflow-y-scroll rounded-2xl border border-emerald-500/70 bg-emerald-600/80 p-2 text-xs text-emerald-50 hover:bg-emerald-500 [&::-webkit-scrollbar]:hidden"
        onPaste={handlePaste}
        onChange={handleChangeTextarea}
        value={sourceText}
        placeholder={t.sourceTextareaPlaceholder}
      />
    </div>
  )
}
