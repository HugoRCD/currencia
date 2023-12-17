export default defineNuxtConfig({
  app: {
    layoutTransition: { name: "fade", mode: "out-in" },
  },

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
    },
  },

  modules: ["@vueuse/nuxt", "@nuxt/ui", "nuxt-svgo", "@nuxt/image", "dayjs-nuxt"],

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
      routes: ["/sitemap.xml"],
    },
  },

  svgo: {
    autoImportPath: "./assets/logo/",
  },

  plugins: [{ src: "~/plugins/vercel.ts", mode: "client" }],
});
