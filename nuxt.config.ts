export default defineNuxtConfig({
  app: {
    layoutTransition: { name: "fade", mode: "out-in" },
  },

  modules: ["@vueuse/nuxt", "@nuxt/ui", "nuxt-svgo", "@nuxt/image", "dayjs-nuxt"],

  routeRules: {
    "/": { isr: true, prerender: true },
    "/app/**": { ssr: false },
  },

  css: ["~/assets/style/main.scss"],

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
      googleRedirectUri: process.env.NUXT_PUBLIC_GOOGLE_REDIRECT_URI,
    },
    private: {
      googleClientSecret: process.env.NUXT_PRIVATE_GOOGLE_CLIENT_SECRET,
      authSecret: process.env.NUXT_PRIVATE_AUTH_TOKEN_SECRET,
      resendApiKey: process.env.NUXT_PRIVATE_RESEND_API_KEY,
      tokeninsightApiKey: process.env.NUXT_PRIVATE_TOKENINSIGHT_API_KEY,
    },
  },

  colorMode: {
    preference: "system",
    fallback: "dark",
    storageKey: "currencia-color-mode",
  },

  image: {
    format: ["webp"],
  },

  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },

  svgo: {
    autoImportPath: "./assets/logo/",
  },

  plugins: [{ src: "~/plugins/vercel.ts", mode: "client" }],
});
