/**
 * useTheme Composable
 *
 * Manages dark/light mode theme switching with system preference detection
 * and persistent user preference storage.
 */

type ThemeMode = 'light' | 'dark' | 'system'

export function useTheme() {
  const colorMode = useState<ThemeMode>('theme-mode', () => 'system')
  const isDark = useState<boolean>('is-dark', () => false)

  // Initialize theme on client side
  function initTheme() {
    if (import.meta.client) {
      // Check for saved preference
      const saved = localStorage.getItem('badge-it-theme') as ThemeMode | null
      if (saved) {
        colorMode.value = saved
      }

      // Apply the theme
      applyTheme()

      // Listen for system preference changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', () => {
        if (colorMode.value === 'system') {
          applyTheme()
        }
      })
    }
  }

  // Apply the current theme to the document
  function applyTheme() {
    if (!import.meta.client) return

    let shouldBeDark: boolean

    if (colorMode.value === 'system') {
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    } else {
      shouldBeDark = colorMode.value === 'dark'
    }

    isDark.value = shouldBeDark

    // Apply to document
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }

  // Toggle between light and dark modes
  function toggleTheme() {
    if (colorMode.value === 'light') {
      setTheme('dark')
    } else if (colorMode.value === 'dark') {
      setTheme('light')
    } else {
      // If system, toggle to opposite of current appearance
      setTheme(isDark.value ? 'light' : 'dark')
    }
  }

  // Set a specific theme
  function setTheme(mode: ThemeMode) {
    colorMode.value = mode
    if (import.meta.client) {
      localStorage.setItem('badge-it-theme', mode)
    }
    applyTheme()
  }

  return {
    colorMode: readonly(colorMode),
    isDark: readonly(isDark),
    initTheme,
    toggleTheme,
    setTheme
  }
}
