<script setup lang="ts">
definePageMeta({
  layout: "app",
});
await useCrypto().fetchPublicCryptos();
</script>

<template>
  <div class="w-full">
    <Suspense>
      <NuxtPage />
      <template #fallback>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <USkeleton v-for="index in 12" :key="index" class="h-44 rounded-lg" />
        </div>
      </template>
    </Suspense>
  </div>
</template>

<style scoped lang="scss"></style>
