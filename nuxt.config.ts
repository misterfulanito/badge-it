// Import the Aura theme
import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'

// Create a custom preset with Navy Blue primary color
const BadgeItPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}'
    }
  }
})

export default defineNuxtConfig({
  // Configure Vue compiler to recognize Ionicons as custom elements
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('ion-')
    }
  },

  // App metadata for SEO
  app: {
    head: {
      title: 'Badge It - Add Badges to Your Profile Picture',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Add professional badges to your profile picture. Privacy-focused: all processing happens in your browser. No uploads, no tracking.'
        },
        { name: 'theme-color', content: '#1e40af' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Badge It - Add Badges to Your Profile Picture' },
        {
          property: 'og:description',
          content:
            'Add professional badges to your profile picture. Privacy-focused: all processing happens in your browser.'
        },
        { property: 'og:image', content: '/og-image.svg' },
        { property: 'og:site_name', content: 'Badge It' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Badge It - Add Badges to Your Profile Picture' },
        {
          name: 'twitter:description',
          content:
            'Add professional badges to your profile picture. Privacy-focused: all processing happens in your browser.'
        },
        { name: 'twitter:image', content: '/og-image.svg' }
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
    }
  },

  // Enable TypeScript for better code checking
  typescript: {
    strict: true
  },

  // Enable Vue DevTools for debugging (disabled in production)
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  // Nuxt modules
  modules: ['@primevue/nuxt-module', '@nuxt/eslint'],

  // Configure PrimeVue with custom Navy Blue theme
  primevue: {
    options: {
      theme: {
        preset: BadgeItPreset,
        options: {
          darkModeSelector: '.dark'
        }
      }
    }
  },

  // CSS files to load globally
  css: ['primeicons/primeicons.css', '~/assets/styles/main.css'],

  // Compatibility settings
  compatibilityDate: '2025-01-14'
})
