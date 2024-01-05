<script setup lang="ts">
definePageMeta({
  layout: "app",
});
if (!usePublicCrypto().value) await useCrypto().fetchPublicCryptos();
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>

<style scoped lang="scss"></style>
