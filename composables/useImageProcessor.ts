type BadgePosition = 'left' | 'center' | 'right'

interface PositionCoordinates {
  x: number
  y: number
}

const PREVIEW_SIZE = 512
const EXPORT_SIZE = 1024
const DEFAULT_BADGE_SIZE_RATIO = 0.3
const MIN_BADGE_SIZE_RATIO = 0.2
const MAX_BADGE_SIZE_RATIO = 0.5
const DEFAULT_PADDING = 10

export function useImageProcessor() {
  // Dynamic badge size ratio (default 30%)
  const badgeSizeRatio = useState<number>('badgeSizeRatio', () => DEFAULT_BADGE_SIZE_RATIO)

  /**
   * Set badge size as a percentage of the image
   * @param percentage - Size as decimal (0.2 = 20%, 0.5 = 50%)
   */
  function setBadgeSize(percentage: number): void {
    // Clamp value between min and max
    const clamped = Math.max(MIN_BADGE_SIZE_RATIO, Math.min(MAX_BADGE_SIZE_RATIO, percentage))
    badgeSizeRatio.value = clamped
  }

  /**
   * Calculate badge position coordinates based on position preference
   * Badge is placed at the bottom of the canvas
   */
  function getPositionCoordinates(
    position: BadgePosition,
    canvasSize: number,
    badgeSize: number,
    padding: number = DEFAULT_PADDING
  ): PositionCoordinates {
    const y = canvasSize - badgeSize - padding

    let x: number

    switch (position) {
      case 'left':
        x = padding
        break
      case 'right':
        x = canvasSize - badgeSize - padding
        break
      case 'center':
      default:
        x = (canvasSize - badgeSize) / 2
        break
    }

    return { x, y }
  }

  /**
   * Render the preview composition at 512x512
   * Combines cropped image with badge overlay
   */
  function renderPreview(
    canvas: HTMLCanvasElement,
    croppedImage: HTMLCanvasElement,
    badgeImage: HTMLImageElement | null,
    position: BadgePosition
  ): void {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions for preview
    canvas.width = PREVIEW_SIZE
    canvas.height = PREVIEW_SIZE

    // Use requestAnimationFrame for smooth rendering
    requestAnimationFrame(() => {
      // Clear canvas
      ctx.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE)

      // Enable image smoothing for quality
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      // Draw the cropped image scaled to preview size
      ctx.drawImage(croppedImage, 0, 0, PREVIEW_SIZE, PREVIEW_SIZE)

      // Draw badge if available
      if (badgeImage && badgeImage.complete && badgeImage.naturalWidth > 0) {
        const badgeSize = Math.round(PREVIEW_SIZE * badgeSizeRatio.value)
        const { x, y } = getPositionCoordinates(position, PREVIEW_SIZE, badgeSize)

        ctx.drawImage(badgeImage, x, y, badgeSize, badgeSize)
      }
    })
  }

  /**
   * Export final image at 1024x1024 for high quality output
   * Returns a Promise that resolves to a Blob
   */
  async function exportImage(
    croppedImage: HTMLCanvasElement,
    badgeImage: HTMLImageElement | null,
    position: BadgePosition
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      // Create offscreen canvas for export
      const exportCanvas = document.createElement('canvas')
      exportCanvas.width = EXPORT_SIZE
      exportCanvas.height = EXPORT_SIZE

      const ctx = exportCanvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      // Enable high quality rendering
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      // Draw the cropped image scaled to export size
      ctx.drawImage(croppedImage, 0, 0, EXPORT_SIZE, EXPORT_SIZE)

      // Draw badge if available
      if (badgeImage && badgeImage.complete && badgeImage.naturalWidth > 0) {
        const badgeSize = Math.round(EXPORT_SIZE * badgeSizeRatio.value)
        const { x, y } = getPositionCoordinates(position, EXPORT_SIZE, badgeSize)

        ctx.drawImage(badgeImage, x, y, badgeSize, badgeSize)
      }

      // Convert to blob
      exportCanvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to create image blob'))
          }
        },
        'image/png',
        1.0
      )
    })
  }

  return {
    getPositionCoordinates,
    renderPreview,
    exportImage,
    badgeSizeRatio: readonly(badgeSizeRatio),
    setBadgeSize,
    PREVIEW_SIZE,
    EXPORT_SIZE,
    MIN_BADGE_SIZE_RATIO,
    MAX_BADGE_SIZE_RATIO,
    DEFAULT_BADGE_SIZE_RATIO
  }
}
