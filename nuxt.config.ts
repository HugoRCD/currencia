export default defineNuxtConfig({
  app: {
    layoutTransition: { name: 'fade', mode: 'out-in' },
  },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@vueuse/nuxt',
    '@nuxt/scripts',
    'nuxt-build-cache',
    'nuxt-auth-utils',
    'dayjs-nuxt',
  ],

  css: ['~/assets/style/main.css'],

  routeRules: {
    '/': { isr: true, prerender: true },
    '/app/**': { ssr: false },
  },

  compatibilityDate: '2024-10-10',

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

  imports: {
    presets: [
      {
        from: 'vue-sonner',
        imports: ['toast'],
      },
    ],
  },

  icon: {
    mode: 'svg',
    customCollections: [
      {
        prefix: 'custom',
        dir: './app/assets/icons',
      },
    ],
  },
})
