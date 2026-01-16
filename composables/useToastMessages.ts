/**
 * useToastMessages Composable
 *
 * Centralized toast notification system for consistent messaging
 * across all components. Uses PrimeVue Toast under the hood.
 */

import { useToast } from 'primevue/usetoast'

// Toast duration constants (in milliseconds)
const DURATION = {
  ERROR: 5000,
  SUCCESS: 3000,
  INFO: 4000
} as const

export function useToastMessages() {
  const toast = useToast()

  // ---------------------------------------------------------------------------
  // Generic Toast Methods
  // ---------------------------------------------------------------------------

  /**
   * Show an error toast (red styling, 5s duration)
   */
  function showError(summary: string, detail?: string) {
    toast.add({
      severity: 'error',
      summary,
      detail,
      life: DURATION.ERROR
    })
  }

  /**
   * Show a success toast (green styling, 3s duration)
   */
  function showSuccess(summary: string, detail?: string) {
    toast.add({
      severity: 'success',
      summary,
      detail,
      life: DURATION.SUCCESS
    })
  }

  /**
   * Show an info toast (blue styling, 4s duration)
   */
  function showInfo(summary: string, detail?: string) {
    toast.add({
      severity: 'info',
      summary,
      detail,
      life: DURATION.INFO
    })
  }

  // ---------------------------------------------------------------------------
  // Predefined Upload Messages
  // ---------------------------------------------------------------------------

  function fileTooLarge() {
    showError('File too large', 'Maximum size is 5MB.')
  }

  function invalidFormat() {
    showError('Invalid format', 'Please upload PNG or JPG.')
  }

  function unreadableImage() {
    showError('Unable to read image', 'Please try another file.')
  }

  // ---------------------------------------------------------------------------
  // Predefined Processing Messages
  // ---------------------------------------------------------------------------

  function browserNotSupported() {
    showError('Browser not supported', "Your browser doesn't support this feature.")
  }

  function processingFailed() {
    showError('Processing failed', 'Try a smaller image.')
  }

  function imageLoadFailed() {
    showError('Failed to load image', 'Please try again.')
  }

  // ---------------------------------------------------------------------------
  // Predefined Badge Messages
  // ---------------------------------------------------------------------------

  function badgeLoadFailed() {
    showError('Badge failed to load', 'Please try another.')
  }

  function noBadgeSelected() {
    showInfo('No badge selected', 'Download image without badge?')
  }

  // ---------------------------------------------------------------------------
  // Predefined Download Messages
  // ---------------------------------------------------------------------------

  function downloadFailed() {
    showError('Download failed', 'Please try again.')
  }

  function downloadBlocked() {
    showInfo('Download blocked', 'Please allow downloads from this site.')
  }

  function downloadSuccess() {
    showSuccess('Downloaded!', 'Your image has been saved.')
  }

  // ---------------------------------------------------------------------------
  // Predefined Action Messages
  // ---------------------------------------------------------------------------

  function changesCleared() {
    showInfo('Reset', 'All changes cleared.')
  }

  return {
    // Generic methods
    showError,
    showSuccess,
    showInfo,

    // Upload messages
    fileTooLarge,
    invalidFormat,
    unreadableImage,

    // Processing messages
    browserNotSupported,
    processingFailed,
    imageLoadFailed,

    // Badge messages
    badgeLoadFailed,
    noBadgeSelected,

    // Download messages
    downloadFailed,
    downloadBlocked,
    downloadSuccess,

    // Action messages
    changesCleared
  }
}
