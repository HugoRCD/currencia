<script lang="ts" setup>
definePageMeta({
  title: 'Home',
  name: 'Home',
  path: '/',
  description: 'Home page',
  keywords: 'Home',
})
</script>

<template>
  <div class="relative mx-auto flex h-full max-w-7xl flex-col justify-center gap-4 bg-white px-4 py-8 sm:px-6 lg:px-8 lg:py-16 dark:bg-zinc-950">
    <!-- grid -->
    <div
      class="bg-grid-black/20 dark:bg-grid-white/5 bg-grid-14 pointer-events-none absolute inset-0 bg-center [mask-image:radial-gradient(white,transparent_80%)]"
    />

    <!-- Hero -->
    <HomeHero />
  </div>
</template>
