<script lang="ts" setup>
import { Toaster } from 'vue-sonner'

useScriptPlausibleAnalytics({
  domain: 'currencia.hrcd.fr',
  scriptInput: {
    src: 'https://analytics.hrcd.fr/js/script.js',
  }
})

useHead({
  title: 'Currencia - The Simplest Crypto Tracker',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' },
    { name: 'author', content: 'Hugo Richard' },
    { charset: 'utf-8' },
    {
      name: 'description',
      content:
        'Currencia is the simplest crypto tracker, with a clean and minimalistic design, you can quickly be up to date with the latest crypto news and prices.',
    },
    {
      name: 'keywords',
      content: 'crypto, tracker, bitcoin, ethereum, litecoin, dogecoin, ripple, binance, coinbase, kraken, crypto news, crypto prices',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
  ],
})

const route = useRoute()

const { loggedIn } = useUserSession()

if (route.path === '/' && loggedIn.value) {
  navigateTo('/app/market')
}

function setPrefersReducedMotion(reduceMotion: boolean) {
  if (reduceMotion) {
    document.documentElement.setAttribute('data-reduce-motion', 'reduce')
  } else {
    document.documentElement.removeAttribute('data-reduce-motion')
  }
}

if (import.meta.client) {
  const reduceMotion = useCookie<boolean>('reduceMotion', {
    watch: true,
  })

  setPrefersReducedMotion(reduceMotion.value)
}
</script>

<template>
  <Html lang="en">
    <Body class="relative selection:bg-neutral-200 dark:selection:bg-neutral-700">
      <LayoutHelpCenter class="absolute bottom-3 right-3 z-20 hidden sm:block" />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <Toaster
        close-button
        position="top-center"
      />
    </Body>
  </Html>
</template>
