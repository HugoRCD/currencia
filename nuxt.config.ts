export default defineNuxtConfig({
  app: {
    layoutTransition: { name: 'fade', mode: 'out-in' },
  },

  future: {
    compatibilityVersion: 4,
  },

  modules: ['@vueuse/nuxt', '@nuxt/ui', 'nuxt-svgo', '@nuxt/image', 'dayjs-nuxt'],

  routeRules: {
    '/': { isr: true, prerender: true },
    '/app/**': { ssr: false },
  },

  compatibilityDate: '2024-10-10',

  css: ['~/assets/style/main.css'],

  devtools: { enabled: true },

  runtimeConfig: {
    private: {
      resendApiKey: process.env.NUXT_PRIVATE_RESEND_API_KEY,
    },
  },

  colorMode: {
    preference: 'system',
    fallback: 'dark',
    storageKey: 'currencia-color-mode',
  },

  image: {
    format: ['webp'],
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/app/market'],
    },
  },
})
