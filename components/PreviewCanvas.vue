<script setup lang="ts">
type BadgePosition = 'left' | 'center' | 'right'

interface Badge {
  src: string | null
  name: string
  isNoBadge?: boolean
}

interface Props {
  croppedImage: HTMLCanvasElement | null
  badge: Badge | null
  position?: BadgePosition
}

const props = withDefaults(defineProps<Props>(), {
  position: 'center'
})

const emit = defineEmits<{
  'canvas-ready': [canvas: HTMLCanvasElement]
}>()

const { renderPreview, PREVIEW_SIZE, badgeSizeRatio } = useImageProcessor()

// Canvas element ref
const canvasRef = ref<HTMLCanvasElement | null>(null)

// Loaded badge image
const badgeImage = ref<HTMLImageElement | null>(null)

// Loading state for badge
const isBadgeLoading = ref(false)

// Track if we have a valid render
const hasRendered = ref(false)

/**
 * Load badge image from URL
 */
async function loadBadgeImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load badge: ${src}`))

    img.src = src
  })
}

/**
 * Render the preview canvas
 */
function render(): void {
  if (!canvasRef.value || !props.croppedImage) {
    hasRendered.value = false
    return
  }

  renderPreview(
    canvasRef.value,
    props.croppedImage,
    badgeImage.value,
    props.position
  )

  hasRendered.value = true

  // Emit canvas ready event
  emit('canvas-ready', canvasRef.value)
}

/**
 * Draw placeholder when no image is loaded
 */
function drawPlaceholder(): void {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = PREVIEW_SIZE
  canvas.height = PREVIEW_SIZE

  // Fill with neutral background
  ctx.fillStyle = 'var(--p-surface-200, #e5e7eb)'
  ctx.fillRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE)

  // Draw placeholder icon (camera/image icon)
  ctx.fillStyle = 'var(--p-surface-400, #9ca3af)'
  ctx.font = '48px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('Upload an image', PREVIEW_SIZE / 2, PREVIEW_SIZE / 2 - 20)

  // Draw helper text
  ctx.font = '16px system-ui, sans-serif'
  ctx.fillText('to see preview', PREVIEW_SIZE / 2, PREVIEW_SIZE / 2 + 30)

  hasRendered.value = false
}

// Watch for badge changes and load image
watch(
  () => props.badge,
  async (newBadge) => {
    if (newBadge?.src) {
      isBadgeLoading.value = true
      try {
        badgeImage.value = await loadBadgeImage(newBadge.src)
      } catch (error) {
        console.error('Failed to load badge image:', error)
        badgeImage.value = null
      } finally {
        isBadgeLoading.value = false
        // Re-render with new badge
        if (props.croppedImage) {
          render()
        }
      }
    } else {
      badgeImage.value = null
      // Re-render without badge
      if (props.croppedImage) {
        render()
      }
    }
  },
  { immediate: true }
)

// Watch for cropped image changes
watch(
  () => props.croppedImage,
  (newImage) => {
    if (newImage) {
      render()
    } else {
      drawPlaceholder()
    }
  },
  { immediate: true }
)

// Watch for position changes
watch(
  () => props.position,
  () => {
    if (props.croppedImage) {
      render()
    }
  }
)

// Watch for badge size changes (from useImageProcessor)
watch(
  badgeSizeRatio,
  () => {
    if (props.croppedImage && badgeImage.value) {
      render()
    }
  }
)

// Initialize canvas on mount
onMounted(() => {
  if (props.croppedImage) {
    render()
  } else {
    drawPlaceholder()
  }
})
</script>

<template>
  <div class="preview-canvas-container">
    <canvas
      ref="canvasRef"
      class="preview-canvas"
      aria-label="Image preview with badge overlay"
      role="img"
    />

    <!-- Loading overlay for badge -->
    <div
      v-if="isBadgeLoading"
      class="loading-overlay"
      aria-live="polite"
      aria-busy="true"
    >
      <span class="loading-spinner" />
      <span class="sr-only">Loading badge...</span>
    </div>
  </div>
</template>

<style scoped>
.preview-canvas-container {
  position: relative;
  width: 100%;
  max-width: 512px;
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  border-radius: var(--p-border-radius-lg, 0.5rem);
  overflow: hidden;
  background-color: var(--p-surface-100, #f3f4f6);
  box-shadow: var(--p-shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05));
}

.preview-canvas {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: inherit;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(0 0 0 / 0.3);
  backdrop-filter: blur(2px);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--p-primary-100, #dbeafe);
  border-top-color: var(--p-primary-500, #3b82f6);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Screen reader only utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Responsive: Full width on mobile, maintain aspect ratio */
@media (max-width: 640px) {
  .preview-canvas-container {
    max-width: 100%;
  }
}

/* Desktop: Fixed 512px size */
@media (min-width: 641px) {
  .preview-canvas-container {
    width: 512px;
    height: 512px;
  }
}
</style>
