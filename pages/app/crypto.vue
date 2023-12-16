<script setup lang="ts">
definePageMeta({
  layout: "app",
});
await useCrypto().fetchPublicCryptos();
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>

<style scoped lang="scss"></style>
