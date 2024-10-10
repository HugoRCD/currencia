<script setup lang="ts">
const user = useCurrentUser();
const publicCryptos = usePublicCrypto();

const userWatchlist = computed(() => {
  return user.value?.watchlist.map((crypto) => crypto.cryptoId);
});

const cryptos = computed(() => {
  return publicCryptos.value.filter((crypto) => userWatchlist.value?.includes(crypto.id));
});
</script>

<template>
  <div class="grid grid-cols-1 gap-4">
    <ChartCryptoCard v-for="(crypto, index) in cryptos.slice(0, 12)" :key="crypto.name" :cryptoItem="crypto" :index="index" />
  </div>
</template>

<style scoped lang="scss"></style>
