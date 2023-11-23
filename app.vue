<script lang="ts" setup>
useHead({
  title: "Currencia - The Simplest Crypto Tracker",
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "author", content: "Hugo Richard" },
    { charset: "utf-8" },
    {
      name: "description",
      content:
        "Currencia is the simplest crypto tracker, with a clean and minimalistic design, you can quickly be up to date with the latest crypto news and prices.",
    },
    {
      name: "keywords",
      content: "crypto, tracker, bitcoin, ethereum, litecoin, dogecoin, ripple, binance, coinbase, kraken, crypto news, crypto prices",
    },
  ],
});
</script>

<template>
  <Html :lang="$i18n.locale">
    <Body class="selection:bg-neutral-200 dark:selection:bg-neutral-700 relative">
      <LayoutScrollToTop />
      <LayoutHelpCenter class="absolute bottom-3 right-3 z-20" />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <UNotifications />
    </Body>
  </Html>
</template>
