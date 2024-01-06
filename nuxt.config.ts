export default defineNuxtConfig({
  app: {
    layoutTransition: { name: "fade", mode: "out-in" },
  },

  modules: ["@vueuse/nuxt", "@nuxt/ui", "nuxt-svgo", "@nuxt/image", "dayjs-nuxt", "@hebilicious/authjs-nuxt"],

  routeRules: {
    "/": { isr: true, prerender: true },
    "/app/**": { ssr: false },
  },

  css: ["~/assets/style/main.scss"],

  devtools: { enabled: true },

  runtimeConfig: {
    private: {
      authSecret: process.env.AUTH_TOKEN_SECRET,
      resendApiKey: process.env.RESEND_API_KEY,
      tokeninsightApiKey: process.env.TOKENINSIGHT_API_KEY,
    },
    authJs: {
      secret: process.env.NUXT_NEXTAUTH_SECRET,
    },
    github: {
      clientId: process.env.NUXT_GITHUB_CLIENT_ID,
      clientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET,
    },
    public: {
      authJs: {
        baseUrl: process.env.NUXT_NEXTAUTH_URL,
        verifyClientOnEveryRequest: true,
      },
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
