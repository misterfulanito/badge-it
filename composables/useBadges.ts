/**
 * useBadges Composable
 *
 * Provides badge data and selection state management for the badge library.
 * Supports single selection with toggle behavior.
 */

export interface Badge {
  id: string
  name: string
  src: string | null
  isNoBadge?: boolean
}

// Badge definitions - flat list with "No Badge" option first
const badges: Badge[] = [
  {
    id: 'no-badge',
    name: 'No Badge',
    src: null,
    isNoBadge: true
  },
  {
    id: 'open-to-work',
    name: 'Open to Work',
    src: '/badges/open-to-work.png'
  },
  {
    id: 'hiring',
    name: 'Hiring',
    src: '/badges/hiring.png'
  },
  {
    id: 'verified',
    name: 'Verified',
    src: '/badges/verified.png'
  }
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
