export type CornerPoint = { x: number; y: number }

export type ScanStatus = 'idle' | 'scanning' | 'success' | 'error'

export type Language = 'vi' | 'ja' | 'en'

export type Translations = {
  heroTitle: string
  heroDesc: string
  overlayDrop: string
  analyzing: string
  found: string
  notFound: string
  copied: string
  notUrl: string
  cameraFound: string
  statusLabel: {
    idle: string
    scanning: string
    success: string
    error: string
  }
  camera: {
    title: string
    hint: string
    start: string
    stop: string
    note: string
    error: string
  }
  uploadCard: {
    title: string
    placeholderTitle: string
    placeholderSub: string
    icon: string
  }
  resultCard: {
    title: string
    empty: string
  }
  buttons: {
    copy: string
    openUrl: string
    reset: string
  }
  realtime: string
  sourceTextareaPlaceholder: string
}
