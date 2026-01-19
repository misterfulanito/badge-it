/**
 * useImageUpscaler Composable
 *
 * Provides AI-powered image upscaling using Upscaler.js
 * Lazy-loads the model only when needed to minimize initial bundle size
 */

export function useImageUpscaler() {
  const isUpscaling = ref(false)
  const progress = ref(0)
  const currentMessage = ref('')

  // Fun wizard messages to show during processing
  const wizardMessages = [
    "Summoning pixel wizards... 🧙‍♂️",
    "Casting enhancement spells... ✨",
    "The magic is brewing... 🔮",
    "Sprinkling quality dust... 🌟",
    "Enchanting your image... 🪄",
    "Wizards are doing their thing... 🧙",
    "Almost there, magic takes time... ⏳",
    "Polishing every pixel... 💎",
    "The sorcery is working... 🌙",
    "Final enchantments in progress... ⚡"
  ]

  let messageInterval: ReturnType<typeof setInterval> | null = null

  function startMessageRotation() {
    let index = 0
    currentMessage.value = wizardMessages[0]
    messageInterval = setInterval(() => {
      index = (index + 1) % wizardMessages.length
      currentMessage.value = wizardMessages[index]
    }, 2500)
  }

  function stopMessageRotation() {
    if (messageInterval) {
      clearInterval(messageInterval)
      messageInterval = null
    }
  }

  /**
   * Upscale an image using AI
   * @param canvas - The source canvas to upscale
   * @returns Promise<Blob> - The upscaled image as a PNG blob
   */
  async function upscaleImage(canvas: HTMLCanvasElement): Promise<Blob> {
    isUpscaling.value = true
    progress.value = 0
    startMessageRotation()

    try {
      // Dynamically import Upscaler to lazy-load the model
      progress.value = 10
      const { default: Upscaler } = await import('upscaler')

      progress.value = 20
      currentMessage.value = "Loading the magic toolkit... 📦"

      // Initialize upscaler with default model
      const upscaler = new Upscaler()

      progress.value = 40
      currentMessage.value = "Preparing the enchantment... 🎭"

      // Convert canvas to image data URL
      const imageDataUrl = canvas.toDataURL('image/png')

      progress.value = 50
      currentMessage.value = "Casting the quality spell... ✨"

      // Upscale the image
      const upscaledDataUrl = await upscaler.upscale(imageDataUrl, {
        output: 'base64',
        patchSize: 64,
        padding: 2,
        progress: (p: number) => {
          // Map upscaler progress (0-1) to our progress (50-90)
          progress.value = 50 + Math.round(p * 40)
        }
      })

      progress.value = 95
      currentMessage.value = "Finalizing the magic... 🎉"

      // Convert base64 to blob
      const response = await fetch(upscaledDataUrl as string)
      const blob = await response.blob()

      progress.value = 100
      currentMessage.value = "Magic complete! ✅"

      // Small delay to show completion message
      await new Promise(resolve => setTimeout(resolve, 500))

      return blob
    } catch (error) {
      console.error('Upscaling failed:', error)
      // Fallback: return original image as blob
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob || new Blob())
        }, 'image/png')
      })
    } finally {
      stopMessageRotation()
      isUpscaling.value = false
      progress.value = 0
    }
  }

  /**
   * Export image without upscaling (fast path)
   */
  async function exportWithoutUpscale(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob || new Blob())
      }, 'image/png')
    })
  }

  return {
    isUpscaling: readonly(isUpscaling),
    progress: readonly(progress),
    currentMessage: readonly(currentMessage),
    upscaleImage,
    exportWithoutUpscale
  }
}
