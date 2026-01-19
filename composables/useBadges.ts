/**
 * useBadges Composable
 *
 * Provides badge data and selection state management for the badge library.
 * Dynamically loads PNG badges from the /public/badges folder.
 * Badge names are generated from filenames (e.g., "open-to-work.png" -> "Open to work")
 */

export interface Badge {
  id: string
  name: string
  src: string | null
  isNoBadge?: boolean
}

/**
 * Convert a filename to a display name
 * e.g., "this-is-a-badge.png" -> "This is a badge"
 */
function fileNameToDisplayName(filename: string): string {
  // Remove extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
  // Replace hyphens with spaces
  const withSpaces = nameWithoutExt.replace(/-/g, ' ')
  // Capitalize first letter only
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1)
}

// Use Vite's glob import to get all PNG files from the badges folder
const badgeFiles = import.meta.glob('/public/badges/*.png', { eager: true, query: '?url', import: 'default' })

// Build badges array dynamically from PNG files
const dynamicBadges: Badge[] = Object.keys(badgeFiles).map((path) => {
  // Extract filename from path (e.g., "/public/badges/hiring.png" -> "hiring.png")
  const filename = path.split('/').pop() || ''
  const id = filename.replace(/\.[^/.]+$/, '') // Remove extension for ID

  return {
    id,
    name: fileNameToDisplayName(filename),
    src: `/badges/${filename}`
  }
}).sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically

// Final badges array with "No Badge" option first
const badges: Badge[] = [
  {
    id: 'no-badge',
    name: 'No Badge',
    src: null,
    isNoBadge: true
  },
  ...dynamicBadges
]

export function useBadges() {
  // Currently selected badge (null if none selected)
  const selectedBadge = useState<Badge | null>('selectedBadge', () => null)

  /**
   * Select a badge. If the same badge is already selected, deselect it (toggle behavior).
   * If "No Badge" is selected, clear the selection.
   * @param badge - The badge to select
   */
  function selectBadge(badge: Badge): void {
    if (badge.isNoBadge) {
      // "No Badge" clears the selection
      selectedBadge.value = null
    } else if (selectedBadge.value?.id === badge.id) {
      // Toggle off if same badge clicked
      selectedBadge.value = null
    } else {
      // Select the new badge
      selectedBadge.value = badge
    }
  }

  /**
   * Clear the current badge selection
   */
  function clearBadge(): void {
    selectedBadge.value = null
  }

  /**
   * Check if a specific badge is currently selected
   * @param badge - The badge to check
   * @returns true if the badge is selected
   */
  function isSelected(badge: Badge): boolean {
    if (badge.isNoBadge) {
      return selectedBadge.value === null
    }
    return selectedBadge.value?.id === badge.id
  }

  return {
    // Data
    badges,

    // State
    selectedBadge: readonly(selectedBadge),

    // Actions
    selectBadge,
    clearBadge,
    isSelected
  }
}
