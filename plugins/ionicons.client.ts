/**
 * Ionicons Plugin
 *
 * Registers Ionicons web components for use throughout the app.
 * Only runs on client-side (.client.ts suffix).
 */

import { defineCustomElements } from 'ionicons/loader'

export default defineNuxtPlugin(() => {
  // Register Ionicons custom elements
  defineCustomElements(window)
})
