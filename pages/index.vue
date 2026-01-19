<script setup lang="ts">
import type { Badge } from '~/composables/useBadges'
import type { BadgePosition } from '~/components/BadgePositioner.vue'

// Composables
const { downloadFailed } = useToastMessages()
const { exportImage, setBadgeSize } = useImageProcessor()
const { isUpscaling, progress, currentMessage, upscaleImage } = useImageUpscaler()

// App state
const croppedCanvas = ref<HTMLCanvasElement | null>(null)
const selectedBadge = ref<Badge | null>(null)
const badgePosition = ref<BadgePosition>('center')
const isDownloading = ref(false)
const showPreviewModal = ref(false)
const showShareMenu = ref(false)

// Badge size state - S/M/L with new pixel values
type BadgeSizeOption = 'small' | 'medium' | 'large'
const badgeSize = ref<BadgeSizeOption>('medium')

// Updated badge sizes per requirements
const BADGE_SIZE_PIXELS: Record<BadgeSizeOption, number> = {
  small: 200,
  medium: 400,
  large: 550
}

// Badge size as percentage for useImageProcessor (based on 1024px output)
const BADGE_SIZE_PERCENT: Record<BadgeSizeOption, number> = {
  small: 19.5,  // 200/1024
  medium: 39,   // 400/1024
  large: 53.7   // 550/1024
}

// Sync badge size with useImageProcessor
watch(badgeSize, (newSize) => {
  setBadgeSize(BADGE_SIZE_PERCENT[newSize] / 100)
}, { immediate: true })

// Reference to UploadCropper component
const uploadCropperRef = ref<InstanceType<typeof import('~/components/UploadCropper.vue').default> | null>(null)

// Collapsible sections state
const expandedSections = ref({
  badges: true,
  position: true,
  size: true
})

// Computed: check if image is loaded
const hasImage = computed(() => !!croppedCanvas.value)

/**
 * Handle image cropped/updated from UploadCropper
 */
function onImageCropped(canvas: HTMLCanvasElement) {
  croppedCanvas.value = canvas
}

/**
 * Handle image removed
 */
function onImageRemoved() {
  croppedCanvas.value = null
  selectedBadge.value = null
  badgePosition.value = 'center'
  badgeSize.value = 'medium'
}

/**
 * Handles badge selection from BadgeLibrary
 */
function onBadgeSelected(badge: Badge | null) {
  selectedBadge.value = badge
}

/**
 * Toggle collapsible section
 */
function toggleSection(section: keyof typeof expandedSections.value) {
  expandedSections.value[section] = !expandedSections.value[section]
}

/**
 * Open preview modal
 */
function openPreviewModal() {
  showPreviewModal.value = true
}

/**
 * Close preview modal
 */
function closePreviewModal() {
  showPreviewModal.value = false
}

/**
 * Toggle share menu
 */
function toggleShareMenu() {
  showShareMenu.value = !showShareMenu.value
}

/**
 * Close share menu
 */
function closeShareMenu() {
  showShareMenu.value = false
}

/**
 * Share via platform
 */
function shareVia(platform: string) {
  const shareText = 'Create badges for your profile pictures with Badge It!'
  const appUrl = window.location.href

  const shareUrls: Record<string, string> = {
    email: `mailto:?subject=Check out Badge It&body=${encodeURIComponent(shareText + ' ' + appUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + appUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}`
  }

  if (platform === 'instagram') {
    // Instagram doesn't support direct sharing, copy link instead
    navigator.clipboard.writeText(appUrl)
    // Could show a toast here, but we're keeping it minimal
    closeShareMenu()
    return
  }

  if (shareUrls[platform]) {
    window.open(shareUrls[platform], '_blank', 'noopener,noreferrer')
  }
  closeShareMenu()
}

/**
 * Download the final image as PNG with AI upscaling
 */
async function downloadImage() {
  if (!croppedCanvas.value) return

  isDownloading.value = true

  try {
    let badgeImg: HTMLImageElement | null = null

    // Only load badge image if badge is selected and has a src
    if (selectedBadge.value?.src) {
      badgeImg = new Image()
      badgeImg.crossOrigin = 'anonymous'

      await new Promise<void>((resolve, reject) => {
        badgeImg!.onload = () => resolve()
        badgeImg!.onerror = () => reject(new Error('Failed to load badge image'))
        badgeImg!.src = selectedBadge.value!.src!
      })
    }

    // Export the composition to a canvas
    const composedBlob = await exportImage(croppedCanvas.value, badgeImg, badgePosition.value)

    // Convert blob to canvas for upscaling
    const composedCanvas = document.createElement('canvas')
    const ctx = composedCanvas.getContext('2d')
    const img = new Image()

    await new Promise<void>((resolve) => {
      img.onload = () => {
        composedCanvas.width = img.width
        composedCanvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        resolve()
      }
      img.src = URL.createObjectURL(composedBlob)
    })

    // Upscale the image using AI magic
    const upscaledBlob = await upscaleImage(composedCanvas)

    // Trigger download
    const url = URL.createObjectURL(upscaledBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'badge-it-profile-hd.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // No success toast - download is self-evident
  } catch (error) {
    console.error('Download failed:', error)
    downloadFailed()
  } finally {
    isDownloading.value = false
  }
}

// Close share menu when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.share-container')) {
    closeShareMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="page-container">
    <!-- Main Content -->
    <main class="main-content">
      <!-- Instructional Header -->
      <header class="page-header">
        <h1 class="page-title">Add a badge to your profile picture</h1>
        <p class="page-subtitle">
          Upload your image for Slack, LinkedIn, or any social network, then customize it with a badge.
        </p>
      </header>

      <!-- Two Column Layout -->
      <div class="main-layout">
        <!-- Left Column: Upload/Cropper with Badge Overlay -->
        <div class="left-column">
          <div class="upload-preview-area">
            <!-- Upload/Cropper Component with Badge Overlay -->
            <UploadCropper
              ref="uploadCropperRef"
              :badge="selectedBadge"
              :position="badgePosition"
              @image-cropped="onImageCropped"
              @image-removed="onImageRemoved"
            />
          </div>
        </div>

        <!-- Right Column: Badge Options -->
        <div class="right-column" :class="{ 'right-column--disabled': !hasImage }">
          <!-- Disabled Message -->
          <div v-if="!hasImage" class="disabled-message">
            <i class="pi pi-lock" aria-hidden="true" />
            <p>Upload an image first to customize your badge</p>
          </div>

          <!-- Badge Options (always rendered, visually disabled when no image) -->
          <div class="options-wrapper" :class="{ 'options-wrapper--disabled': !hasImage }">
            <!-- Badge Selection Section -->
            <div class="collapsible-section">
              <button
                class="section-header"
                :aria-expanded="expandedSections.badges"
                :disabled="!hasImage"
                @click="toggleSection('badges')"
              >
                <span class="section-title">
                  <i class="pi pi-star" aria-hidden="true" />
                  Select Badge
                </span>
                <i
                  class="pi section-chevron"
                  :class="expandedSections.badges ? 'pi-chevron-up' : 'pi-chevron-down'"
                  aria-hidden="true"
                />
              </button>
              <div v-show="expandedSections.badges" class="section-content">
                <BadgeLibrary @badge-selected="onBadgeSelected" />
              </div>
            </div>

            <!-- Position Section -->
            <div class="collapsible-section">
              <button
                class="section-header"
                :aria-expanded="expandedSections.position"
                :disabled="!hasImage"
                @click="toggleSection('position')"
              >
                <span class="section-title">
                  <i class="pi pi-arrows-alt" aria-hidden="true" />
                  Badge Position
                </span>
                <i
                  class="pi section-chevron"
                  :class="expandedSections.position ? 'pi-chevron-up' : 'pi-chevron-down'"
                  aria-hidden="true"
                />
              </button>
              <div v-show="expandedSections.position" class="section-content">
                <BadgePositioner
                  v-model="badgePosition"
                  :disabled="!selectedBadge || !hasImage"
                />
              </div>
            </div>

            <!-- Badge Size Section -->
            <div class="collapsible-section">
              <button
                class="section-header"
                :aria-expanded="expandedSections.size"
                :disabled="!hasImage"
                @click="toggleSection('size')"
              >
                <span class="section-title">
                  <i class="pi pi-expand" aria-hidden="true" />
                  Badge Size
                </span>
                <i
                  class="pi section-chevron"
                  :class="expandedSections.size ? 'pi-chevron-up' : 'pi-chevron-down'"
                  aria-hidden="true"
                />
              </button>
              <div v-show="expandedSections.size" class="section-content">
                <div class="size-controls">
                  <div class="size-options">
                    <label
                      class="size-option"
                      :class="{
                        'size-option--selected': badgeSize === 'small',
                        'size-option--disabled': !selectedBadge || !hasImage
                      }"
                    >
                      <input
                        v-model="badgeSize"
                        type="radio"
                        name="badgeSize"
                        value="small"
                        :disabled="!selectedBadge || !hasImage"
                        class="size-radio"
                      />
                      <span class="size-option-content">
                        <span class="size-option-label">S</span>
                        <span class="size-option-value">{{ BADGE_SIZE_PIXELS.small }}px</span>
                      </span>
                    </label>

                    <label
                      class="size-option"
                      :class="{
                        'size-option--selected': badgeSize === 'medium',
                        'size-option--disabled': !selectedBadge || !hasImage
                      }"
                    >
                      <input
                        v-model="badgeSize"
                        type="radio"
                        name="badgeSize"
                        value="medium"
                        :disabled="!selectedBadge || !hasImage"
                        class="size-radio"
                      />
                      <span class="size-option-content">
                        <span class="size-option-label">M</span>
                        <span class="size-option-value">{{ BADGE_SIZE_PIXELS.medium }}px</span>
                      </span>
                    </label>

                    <label
                      class="size-option"
                      :class="{
                        'size-option--selected': badgeSize === 'large',
                        'size-option--disabled': !selectedBadge || !hasImage
                      }"
                    >
                      <input
                        v-model="badgeSize"
                        type="radio"
                        name="badgeSize"
                        value="large"
                        :disabled="!selectedBadge || !hasImage"
                        class="size-radio"
                      />
                      <span class="size-option-content">
                        <span class="size-option-label">L</span>
                        <span class="size-option-value">{{ BADGE_SIZE_PIXELS.large }}px</span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Sticky Bottom Action Bar -->
    <div class="sticky-action-bar">
      <div class="action-bar-content">
        <!-- Share Button -->
        <div class="share-container">
          <Button
            label="Share"
            severity="secondary"
            text
            icon="pi pi-share-alt"
            @click.stop="toggleShareMenu"
          />
          <!-- Share Dropdown -->
          <div v-if="showShareMenu" class="share-dropdown">
            <button class="share-option" @click="shareVia('email')">
              <i class="pi pi-envelope" />
              Email
            </button>
            <button class="share-option" @click="shareVia('whatsapp')">
              <i class="pi pi-whatsapp" />
              WhatsApp
            </button>
            <button class="share-option" @click="shareVia('twitter')">
              <i class="pi pi-twitter" />
              Twitter
            </button>
            <button class="share-option" @click="shareVia('instagram')">
              <i class="pi pi-instagram" />
              Instagram (Copy Link)
            </button>
            <button class="share-option" @click="shareVia('linkedin')">
              <i class="pi pi-linkedin" />
              LinkedIn
            </button>
          </div>
        </div>

        <!-- Preview Button -->
        <Button
          label="Preview"
          severity="secondary"
          outlined
          icon="pi pi-eye"
          :disabled="!hasImage"
          @click="openPreviewModal"
        />

        <!-- Download Button -->
        <Button
          :label="isDownloading ? 'Downloading...' : 'Download'"
          severity="primary"
          :icon="isDownloading ? 'pi pi-spin pi-spinner' : 'pi pi-download'"
          :loading="isDownloading"
          :disabled="!hasImage"
          @click="downloadImage"
        />
      </div>
    </div>

    <!-- Preview Modal -->
    <Teleport to="body">
      <div v-if="showPreviewModal" class="modal-overlay" @click.self="closePreviewModal">
        <div class="modal-content">
          <button class="modal-close" aria-label="Close preview" @click="closePreviewModal">
            <i class="pi pi-times" />
          </button>
          <div class="modal-preview">
            <PreviewCanvas
              v-if="croppedCanvas"
              :cropped-image="croppedCanvas"
              :badge="selectedBadge"
              :position="badgePosition"
            />
          </div>
          <p class="modal-hint">Your image at full resolution (1024 x 1024px)</p>
        </div>
      </div>
    </Teleport>

    <!-- Wizard Processing Modal -->
    <Teleport to="body">
      <div v-if="isUpscaling" class="wizard-modal-overlay">
        <div class="wizard-modal">
          <div class="wizard-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <div class="wizard-sparkles">
              <span class="sparkle sparkle-1">✨</span>
              <span class="sparkle sparkle-2">⭐</span>
              <span class="sparkle sparkle-3">✨</span>
              <span class="sparkle sparkle-4">🌟</span>
            </div>
          </div>
          <h2 class="wizard-title">Image Wizardry in Progress</h2>
          <p class="wizard-message">{{ currentMessage }}</p>
          <div class="wizard-progress-container">
            <div class="wizard-progress-bar" :style="{ width: `${progress}%` }" />
          </div>
          <p class="wizard-progress-text">{{ progress }}% complete</p>
          <p class="wizard-note">Please don't close this window while our pixel wizards work their magic!</p>
        </div>
      </div>
    </Teleport>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<style scoped>
/* ============================================================================
   Page Layout
   ============================================================================ */

.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
}

.main-content {
  flex: 1;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem;
}

/* ============================================================================
   Page Header
   ============================================================================ */

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.5rem;
}

.page-subtitle {
  font-size: 1rem;
  color: var(--text-color-secondary);
  margin: 0;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

/* ============================================================================
   Two Column Layout
   ============================================================================ */

.main-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .main-layout {
    grid-template-columns: 3fr 2fr;
    gap: 32px;
  }
}

/* Left Column */
.left-column {
  min-width: 0;
}

.upload-preview-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Right Column */
.right-column {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.right-column--disabled {
  position: relative;
}

.disabled-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background-color: var(--surface-50);
  border-radius: var(--border-radius-lg);
  text-align: center;
}

.disabled-message i {
  font-size: 1.5rem;
  color: var(--text-color-muted);
}

.disabled-message p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.options-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.options-wrapper--disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* ============================================================================
   Collapsible Sections
   ============================================================================ */

.collapsible-section {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  background-color: var(--surface-0);
}

.section-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9375rem;
  color: var(--text-color);
  transition: background-color 0.2s ease;
}

.section-header:hover:not(:disabled) {
  background-color: var(--surface-50);
}

.section-header:disabled {
  cursor: not-allowed;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
}

.section-title i {
  color: var(--primary-color);
}

.section-chevron {
  color: var(--text-color-muted);
  transition: transform 0.3s ease;
}

.section-content {
  border-top: 1px solid var(--border-color);
}

/* ============================================================================
   Badge Size Controls
   ============================================================================ */

.size-controls {
  padding: 1rem;
}

.size-options {
  display: flex;
  gap: 0.75rem;
}

.size-option {
  flex: 1;
  position: relative;
  cursor: pointer;
}

.size-radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.size-option-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.875rem 0.5rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--surface-0);
  transition: all 0.2s ease;
}

.size-option:hover:not(.size-option--disabled) .size-option-content {
  border-color: var(--primary-color);
  background-color: var(--surface-50);
}

.size-option--selected .size-option-content {
  border-color: var(--primary-color);
  background-color: var(--primary-50, rgba(30, 64, 175, 0.08));
}

.size-option--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.size-option-label {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-color);
}

.size-option--selected .size-option-label {
  color: var(--primary-color);
}

.size-option-value {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}

/* ============================================================================
   Sticky Bottom Action Bar
   ============================================================================ */

.sticky-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: var(--surface-0);
  border-top: 1px solid var(--border-color);
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
}

.action-bar-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.action-bar-content :deep(.p-button) {
  min-height: 44px;
}

/* Share Container */
.share-container {
  position: relative;
}

.share-dropdown {
  position: absolute;
  bottom: 100%;
  left: 0;
  margin-bottom: 0.5rem;
  min-width: 180px;
  background-color: var(--surface-0);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  z-index: 110;
}

.share-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  font-size: 0.875rem;
  color: var(--text-color);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.share-option:hover {
  background-color: var(--surface-50);
}

.share-option i {
  font-size: 1rem;
  color: var(--text-color-secondary);
}

/* ============================================================================
   Preview Modal
   ============================================================================ */

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  position: relative;
  background-color: var(--surface-0);
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.modal-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 50%;
  color: var(--text-color-secondary);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.modal-close:hover {
  background-color: var(--surface-100);
  color: var(--text-color);
}

.modal-preview {
  width: min(512px, 80vw);
  aspect-ratio: 1;
}

.modal-preview :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
  border-radius: var(--border-radius);
}

.modal-hint {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  margin: 0;
}

/* ============================================================================
   Responsive Adjustments
   ============================================================================ */

@media (max-width: 768px) {
  .page-container {
    padding-bottom: 100px;
  }

  .main-content {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 0.9375rem;
  }

  .action-bar-content {
    gap: 0.5rem;
    padding: 0.875rem 1rem;
  }

  .action-bar-content :deep(.p-button) {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .action-bar-content :deep(.p-button .p-button-label) {
    font-size: 0.875rem;
  }

  .share-dropdown {
    left: auto;
    right: 0;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.25rem;
  }

  .size-options {
    gap: 0.5rem;
  }

  .size-option-content {
    padding: 0.75rem 0.25rem;
  }

  .modal-content {
    padding: 1.5rem 1rem;
  }
}

/* ============================================================================
   Wizard Processing Modal
   ============================================================================ */

.wizard-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.wizard-modal {
  background: #ffffff;
  border-radius: 24px;
  padding: 3rem 2.5rem;
  text-align: center;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4), 0 0 60px rgba(139, 92, 246, 0.2);
  border: 1px solid var(--surface-200);
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.wizard-icon {
  position: relative;
  margin-bottom: 1.5rem;
  display: inline-block;
  color: #8b5cf6;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.wizard-sparkles {
  position: absolute;
  inset: -20px;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  font-size: 1.25rem;
  animation: sparkleFloat 2s ease-in-out infinite;
}

.sparkle-1 {
  top: 0;
  left: 10%;
  animation-delay: 0s;
}

.sparkle-2 {
  top: 20%;
  right: 0;
  animation-delay: 0.5s;
}

.sparkle-3 {
  bottom: 10%;
  left: 0;
  animation-delay: 1s;
}

.sparkle-4 {
  bottom: 0;
  right: 15%;
  animation-delay: 1.5s;
}

@keyframes sparkleFloat {
  0%, 100% {
    opacity: 0.4;
    transform: translateY(0) scale(0.8);
  }
  50% {
    opacity: 1;
    transform: translateY(-8px) scale(1.2);
  }
}

.wizard-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.75rem;
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.wizard-message {
  font-size: 1.125rem;
  color: var(--text-color);
  margin: 0 0 1.5rem;
  min-height: 1.5em;
  transition: opacity 0.3s ease;
}

.wizard-progress-container {
  background: var(--surface-200);
  border-radius: 100px;
  height: 12px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.wizard-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%);
  border-radius: 100px;
  transition: width 0.3s ease;
  position: relative;
}

.wizard-progress-bar::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.wizard-progress-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #8b5cf6;
  margin: 0 0 1rem;
}

.wizard-note {
  font-size: 0.8125rem;
  color: var(--text-color-secondary);
  margin: 0;
  font-style: italic;
}

/* ============================================================================
   Reduced Motion
   ============================================================================ */

@media (prefers-reduced-motion: reduce) {
  .section-chevron,
  .size-option-content,
  .share-option,
  .modal-close,
  .wizard-modal-overlay,
  .wizard-modal,
  .wizard-icon,
  .sparkle,
  .wizard-progress-bar::after {
    animation: none;
    transition: none;
  }
}
</style>
