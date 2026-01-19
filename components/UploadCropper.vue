<script setup lang="ts">
/**
 * UploadCropper Component
 *
 * A unified component that combines image upload, cropping, and badge preview into a single view.
 * Shows a dotted upload area initially, then transforms into a cropper with badge overlay when
 * an image is loaded. Uses Cropper.js for image cropping with 1:1 aspect ratio.
 */

import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BadgePosition = 'left' | 'center' | 'right'

interface Badge {
  src: string | null
  name: string
  isNoBadge?: boolean
}

// ---------------------------------------------------------------------------
// Props & Emits
// ---------------------------------------------------------------------------

interface Props {
  badge?: Badge | null
  position?: BadgePosition
}

const props = withDefaults(defineProps<Props>(), {
  badge: null,
  position: 'center'
})

const emit = defineEmits<{
  'image-cropped': [canvas: HTMLCanvasElement]
  'image-removed': []
}>()

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MIN_ZOOM_MULTIPLIER = 1.0 // 100% of initial fit
const MAX_ZOOM_MULTIPLIER = 3.0 // 300% of initial fit
const ZOOM_STEP_MULTIPLIER = 0.25 // 25% step
const MAX_FILE_SIZE = 12 * 1024 * 1024 // 12MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const OUTPUT_SIZE = 1024 // Final output size
const BADGE_PADDING = 10 // Padding from edges in pixels (percentage based)

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const imageRef = ref<HTMLImageElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const cropperInstance = ref<Cropper | null>(null)
const imageSrc = ref<string | null>(null)
const isLoading = ref(false)
const isDragging = ref(false)
const errorMessage = ref<string | null>(null)

// Zoom state - relative to initial fit
const initialZoomRatio = ref(1) // The ratio when image first fits
const currentZoomMultiplier = ref(1) // Current zoom as multiplier of initial (1 = 100%)

// Badge state
const badgeImage = ref<HTMLImageElement | null>(null)
const isBadgeLoading = ref(false)

// Get badge size ratio from composable
const { badgeSizeRatio } = useImageProcessor()

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------

const hasImage = computed(() => !!imageSrc.value)
const zoomPercent = computed(() => Math.round(currentZoomMultiplier.value * 100))
const isZoomOutDisabled = computed(() => currentZoomMultiplier.value <= MIN_ZOOM_MULTIPLIER)
const isZoomInDisabled = computed(() => currentZoomMultiplier.value >= MAX_ZOOM_MULTIPLIER)

// Compute badge overlay styles for positioning
const badgeOverlayStyle = computed(() => {
  if (!badgeImage.value || !props.badge?.src) {
    return { display: 'none' }
  }

  // Badge size as percentage of container
  const sizePercent = badgeSizeRatio.value * 100
  const paddingPercent = (BADGE_PADDING / 512) * 100 // Based on preview size ratio

  // Position calculations
  let left = '50%'
  let transform = 'translateX(-50%)'

  if (props.position === 'left') {
    left = `${paddingPercent}%`
    transform = 'translateX(0)'
  } else if (props.position === 'right') {
    left = 'auto'
    transform = 'translateX(0)'
  }

  const bottom = `${paddingPercent}%`

  return {
    display: 'block',
    width: `${sizePercent}%`,
    height: `${sizePercent}%`,
    bottom,
    left: props.position === 'right' ? 'auto' : left,
    right: props.position === 'right' ? `${paddingPercent}%` : 'auto',
    transform: props.position === 'center' ? transform : 'none'
  }
})

// ---------------------------------------------------------------------------
// Badge Loading
// ---------------------------------------------------------------------------

async function loadBadgeImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load badge: ${src}`))
    img.src = src
  })
}

// Watch for badge changes
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
      }
    } else {
      badgeImage.value = null
    }
  },
  { immediate: true }
)

// ---------------------------------------------------------------------------
// File Handling
// ---------------------------------------------------------------------------

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Please upload a PNG, JPG, or WebP image'
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'File size must be less than 12MB'
  }
  return null
}

function handleFile(file: File): void {
  const error = validateFile(file)
  if (error) {
    errorMessage.value = error
    return
  }

  errorMessage.value = null
  isLoading.value = true

  const reader = new FileReader()
  reader.onload = (e) => {
    imageSrc.value = e.target?.result as string
    isLoading.value = false
  }
  reader.onerror = () => {
    errorMessage.value = 'Failed to read file'
    isLoading.value = false
  }
  reader.readAsDataURL(file)
}

function onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    handleFile(file)
  }
}

function triggerFileInput(): void {
  fileInputRef.value?.click()
}

// ---------------------------------------------------------------------------
// Drag & Drop
// ---------------------------------------------------------------------------

function onDragEnter(event: DragEvent): void {
  event.preventDefault()
  isDragging.value = true
}

function onDragLeave(event: DragEvent): void {
  event.preventDefault()
  isDragging.value = false
}

function onDragOver(event: DragEvent): void {
  event.preventDefault()
}

function onDrop(event: DragEvent): void {
  event.preventDefault()
  isDragging.value = false

  const file = event.dataTransfer?.files?.[0]
  if (file) {
    handleFile(file)
  }
}

// ---------------------------------------------------------------------------
// Cropper Setup
// ---------------------------------------------------------------------------

function initCropper(): void {
  if (!imageRef.value || cropperInstance.value) return

  cropperInstance.value = new Cropper(imageRef.value, {
    aspectRatio: 1,
    viewMode: 2, // Restrict crop box to fit within container, image can extend outside
    dragMode: 'move',
    autoCropArea: 1, // Crop box fills the entire container
    responsive: true,
    restore: false,
    guides: true,
    center: true,
    highlight: false,
    cropBoxMovable: false,
    cropBoxResizable: false,
    toggleDragModeOnDblclick: false,
    minContainerWidth: 200,
    minContainerHeight: 200,
    ready() {
      // Store the initial zoom ratio (when image is fit to fill the crop area)
      const imageData = cropperInstance.value?.getImageData()
      if (imageData) {
        // Calculate the ratio needed to fill the crop box
        const containerData = cropperInstance.value?.getContainerData()
        if (containerData) {
          const naturalWidth = imageData.naturalWidth
          const naturalHeight = imageData.naturalHeight
          const containerSize = Math.min(containerData.width, containerData.height)

          // For rectangular images, calculate based on the smaller dimension to ensure fill
          const minDimension = Math.min(naturalWidth, naturalHeight)
          initialZoomRatio.value = containerSize / minDimension

          // Zoom to fill the crop box initially
          cropperInstance.value?.zoomTo(initialZoomRatio.value)
        }
      }
      currentZoomMultiplier.value = 1
      // Auto-emit initial crop for single-page preview
      nextTick(() => emitCroppedCanvas())
    },
    cropend() {
      // Auto-emit when user finishes adjusting crop
      emitCroppedCanvas()
    },
    zoom(event) {
      // Calculate the new multiplier relative to initial zoom
      const newRatio = event.detail.ratio
      const newMultiplier = newRatio / initialZoomRatio.value

      // Constrain zoom to min/max multipliers
      if (newMultiplier < MIN_ZOOM_MULTIPLIER) {
        event.preventDefault()
        const constrainedRatio = initialZoomRatio.value * MIN_ZOOM_MULTIPLIER
        cropperInstance.value?.zoomTo(constrainedRatio)
        currentZoomMultiplier.value = MIN_ZOOM_MULTIPLIER
      } else if (newMultiplier > MAX_ZOOM_MULTIPLIER) {
        event.preventDefault()
        const constrainedRatio = initialZoomRatio.value * MAX_ZOOM_MULTIPLIER
        cropperInstance.value?.zoomTo(constrainedRatio)
        currentZoomMultiplier.value = MAX_ZOOM_MULTIPLIER
      } else {
        currentZoomMultiplier.value = newMultiplier
      }
      // Emit after zoom change
      emitCroppedCanvas()
    }
  })
}

function destroyCropper(): void {
  if (cropperInstance.value) {
    cropperInstance.value.destroy()
    cropperInstance.value = null
  }
}

// ---------------------------------------------------------------------------
// Zoom Controls
// ---------------------------------------------------------------------------

function setZoomMultiplier(multiplier: number): void {
  if (!cropperInstance.value) return
  const clampedMultiplier = Math.max(MIN_ZOOM_MULTIPLIER, Math.min(MAX_ZOOM_MULTIPLIER, multiplier))
  const targetRatio = initialZoomRatio.value * clampedMultiplier
  cropperInstance.value.zoomTo(targetRatio)
  currentZoomMultiplier.value = clampedMultiplier
  emitCroppedCanvas()
}

function zoomIn(): void {
  setZoomMultiplier(currentZoomMultiplier.value + ZOOM_STEP_MULTIPLIER)
}

function zoomOut(): void {
  setZoomMultiplier(currentZoomMultiplier.value - ZOOM_STEP_MULTIPLIER)
}

function onSliderChange(value: number): void {
  setZoomMultiplier(value / 100)
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

/**
 * Emit the current cropped canvas for real-time preview updates
 */
function emitCroppedCanvas(): void {
  const canvas = getCroppedCanvas()
  if (canvas) {
    emit('image-cropped', canvas)
  }
}

function getCroppedCanvas(): HTMLCanvasElement | null {
  if (!cropperInstance.value) return null

  return cropperInstance.value.getCroppedCanvas({
    width: OUTPUT_SIZE,
    height: OUTPUT_SIZE,
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high'
  })
}

function confirmCrop(): void {
  const canvas = getCroppedCanvas()
  if (canvas) {
    emit('image-cropped', canvas)
  }
}

function resetImage(): void {
  destroyCropper()
  imageSrc.value = null
  initialZoomRatio.value = 1
  currentZoomMultiplier.value = 1
  errorMessage.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  emit('image-removed')
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

watch(imageSrc, (newSrc) => {
  if (newSrc) {
    // Wait for image element to be rendered
    nextTick(() => {
      // Wait for image to load
      if (imageRef.value) {
        if (imageRef.value.complete) {
          initCropper()
        } else {
          imageRef.value.onload = () => initCropper()
        }
      }
    })
  } else {
    destroyCropper()
  }
})

onUnmounted(() => {
  destroyCropper()
})

// ---------------------------------------------------------------------------
// Expose
// ---------------------------------------------------------------------------

defineExpose({
  confirmCrop,
  resetImage,
  getCroppedCanvas,
  hasImage
})
</script>

<template>
  <div class="upload-cropper">
    <!-- Upload Area (shown when no image) -->
    <div
      v-if="!hasImage"
      class="upload-area"
      :class="{ 'upload-area--dragging': isDragging }"
      role="button"
      tabindex="0"
      aria-label="Upload image area. Click or drag and drop an image."
      @click="triggerFileInput"
      @keydown.enter="triggerFileInput"
      @keydown.space.prevent="triggerFileInput"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @dragover="onDragOver"
      @drop="onDrop"
    >
      <input
        ref="fileInputRef"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        class="file-input"
        aria-hidden="true"
        @change="onFileChange"
      />

      <!-- Loading State -->
      <div v-if="isLoading" class="upload-loading">
        <span class="spinner" />
        <span>Loading...</span>
      </div>

      <!-- Upload Content -->
      <div v-else class="upload-content">
        <div class="upload-icons">
          <!-- Image Icon -->
          <svg
            class="icon-image"
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>

          <!-- Upload Icon -->
          <svg
            class="icon-upload"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <p class="upload-text">
          <span class="upload-text-primary">Drag and drop or click to upload</span>
          <span class="upload-text-secondary">PNG, JPG up to 12MB</span>
        </p>
      </div>

      <!-- Error Message -->
      <p v-if="errorMessage" class="upload-error" role="alert">
        {{ errorMessage }}
      </p>
    </div>

    <!-- Cropper Area with Badge Overlay (shown when image is loaded) -->
    <div v-else class="cropper-area">
      <div class="cropper-container">
        <img ref="imageRef" :src="imageSrc!" alt="Image to crop" class="cropper-image" />

        <!-- Badge Overlay - positioned on top of cropper view box -->
        <div
          v-if="badgeImage && badge?.src"
          class="badge-overlay"
          :style="badgeOverlayStyle"
          aria-hidden="true"
        >
          <img
            :src="badge.src"
            :alt="badge.name"
            class="badge-overlay-image"
          />
        </div>

        <!-- Loading indicator for badge -->
        <div v-if="isBadgeLoading" class="badge-loading">
          <span class="badge-spinner" />
        </div>
      </div>

      <!-- Change Photo Button -->
      <button class="change-photo-btn" type="button" @click="resetImage">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Change Photo
      </button>
    </div>

    <!-- Zoom Controls (always visible, disabled when no image) -->
    <div class="zoom-controls" :class="{ 'zoom-controls--disabled': !hasImage }">
      <div class="zoom-header">
        <span class="zoom-label">Zoom</span>
        <span class="zoom-value">{{ zoomPercent }}%</span>
      </div>

      <div class="zoom-slider-row">
        <button
          type="button"
          class="zoom-btn"
          :disabled="!hasImage || isZoomOutDisabled"
          aria-label="Zoom out"
          @click="zoomOut"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <div class="slider-container">
          <Slider
            :model-value="zoomPercent"
            :min="100"
            :max="300"
            :step="25"
            :disabled="!hasImage"
            aria-label="Zoom level"
            @update:model-value="onSliderChange"
          />
          <div class="slider-labels">
            <span>100%</span>
            <span>200%</span>
            <span>300%</span>
          </div>
        </div>

        <button
          type="button"
          class="zoom-btn"
          :disabled="!hasImage || isZoomInDisabled"
          aria-label="Zoom in"
          @click="zoomIn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      <p class="zoom-hint">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        Drag the image to adjust position
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Base */
.upload-cropper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}

/* Upload Area */
.upload-area {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius-lg, 12px);
  background-color: var(--surface-50);
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-area:hover {
  border-color: var(--primary-color);
  background-color: var(--surface-100);
}

.upload-area--dragging {
  border-color: var(--primary-color);
  background-color: var(--primary-50, rgba(30, 64, 175, 0.05));
  border-style: solid;
}

.upload-area:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

/* Upload Content */
.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.upload-icons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.icon-image {
  color: var(--text-color-secondary);
  opacity: 0.6;
  transition: all 0.2s ease;
}

.icon-upload {
  color: var(--text-color-secondary);
  transition: all 0.2s ease;
}

.upload-area:hover .icon-image,
.upload-area:hover .icon-upload {
  color: var(--primary-color);
  opacity: 1;
}

.upload-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  text-align: center;
}

.upload-text-primary {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
}

.upload-text-secondary {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.upload-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--text-color-secondary);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--surface-200);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.upload-error {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background-color: var(--red-50, #fef2f2);
  color: var(--red-600, #dc2626);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
}

/* Cropper Area */
.cropper-area {
  position: relative;
}

.cropper-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--border-radius-lg, 12px);
  overflow: hidden;
  background-color: var(--surface-900);
}

.cropper-image {
  display: block;
  max-width: 100%;
}

/* Badge Overlay */
.badge-overlay {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  transition: all 0.2s ease;
}

.badge-overlay-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.badge-loading {
  position: absolute;
  bottom: 2%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}

.badge-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Cropper.js Overrides */
:deep(.cropper-container) {
  border-radius: var(--border-radius-lg, 12px);
}

/* Hide the dark overlay/modal - the entire preview box is the crop area */
:deep(.cropper-modal) {
  display: none;
}

:deep(.cropper-view-box) {
  outline: none;
}

:deep(.cropper-face) {
  background-color: transparent;
}

:deep(.cropper-dashed) {
  display: none;
}

:deep(.cropper-center) {
  display: none;
}

:deep(.cropper-point) {
  display: none;
}

:deep(.cropper-line) {
  display: none;
}

/* Change Photo Button */
.change-photo-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  z-index: 20;
}

.change-photo-btn:hover {
  background-color: rgba(0, 0, 0, 0.85);
}

.change-photo-btn:focus-visible {
  outline: 2px solid white;
  outline-offset: 2px;
}

/* Zoom Controls */
.zoom-controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background-color: var(--surface-50);
  border-radius: var(--border-radius-lg, 12px);
  transition: opacity 0.2s ease;
}

.zoom-controls--disabled {
  opacity: 0.5;
  pointer-events: none;
}

.zoom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.zoom-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color);
}

.zoom-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary-color);
  background-color: var(--surface-100);
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius);
}

.zoom-slider-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.zoom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: var(--surface-100);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.zoom-btn:hover:not(:disabled) {
  background-color: var(--surface-200);
}

.zoom-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.zoom-btn:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.slider-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 2px;
}

.slider-labels span {
  font-size: 0.6875rem;
  color: var(--text-color-muted);
}

.zoom-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.8125rem;
  color: var(--text-color-secondary);
}

.zoom-hint svg {
  color: var(--primary-color);
  flex-shrink: 0;
}

/* Slider Customization */
:deep(.p-slider) {
  background-color: var(--surface-200);
}

:deep(.p-slider-range) {
  background-color: var(--primary-color);
}

:deep(.p-slider-handle) {
  width: 18px;
  height: 18px;
  background-color: var(--primary-color);
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

:deep(.p-slider-handle:hover) {
  transform: scale(1.15);
}

/* Responsive */
@media (max-width: 560px) {
  .upload-area {
    min-height: 300px;
    padding: 1.5rem;
  }

  .icon-image {
    width: 48px;
    height: 48px;
  }

  .zoom-controls {
    padding: 0.875rem;
  }

  .zoom-btn {
    width: 36px;
    height: 36px;
  }
}

/* Touch Optimization */
@media (pointer: coarse) {
  .zoom-btn {
    width: 44px;
    height: 44px;
  }

  :deep(.p-slider-handle) {
    width: 24px;
    height: 24px;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .upload-area,
  .icon-image,
  .icon-upload,
  .zoom-btn,
  .change-photo-btn,
  .badge-overlay {
    transition: none;
  }

  .spinner,
  .badge-spinner {
    animation: none;
  }
}
</style>
