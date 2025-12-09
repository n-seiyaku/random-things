import { CornerPoint } from '../types/type'

export function cropQRFromSource(
  sourceWidth: number,
  sourceHeight: number,
  drawSource: (ctx: CanvasRenderingContext2D) => void,
  corners: CornerPoint[],
  padding = 50
): string {
  const sourceCanvas = document.createElement('canvas')
  sourceCanvas.width = sourceWidth
  sourceCanvas.height = sourceHeight
  const sourceCtx = sourceCanvas.getContext('2d')
  if (!sourceCtx) throw new Error('Không lấy được 2d context')
  drawSource(sourceCtx)

  const xs = corners.map((p) => p.x)
  const ys = corners.map((p) => p.y)

  let minX = Math.floor(Math.min(...xs))
  let maxX = Math.ceil(Math.max(...xs))
  let minY = Math.floor(Math.min(...ys))
  let maxY = Math.ceil(Math.max(...ys))

  minX = Math.max(0, minX)
  minY = Math.max(0, minY)
  maxX = Math.min(sourceCanvas.width, maxX)
  maxY = Math.min(sourceCanvas.height, maxY)

  const width = maxX - minX
  const height = maxY - minY

  const cropCanvas = document.createElement('canvas')
  cropCanvas.width = width + padding * 2
  cropCanvas.height = height + padding * 2
  const cropCtx = cropCanvas.getContext('2d')
  if (!cropCtx) throw new Error('Không lấy được 2d context')

  cropCtx.fillStyle = '#fff'
  cropCtx.fillRect(0, 0, cropCanvas.width, cropCanvas.height)

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
  )

  return cropCanvas.toDataURL('image/png')
}
