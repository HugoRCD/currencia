<script setup lang="ts">
const { user } = useUserSession()
const publicCryptos = usePublicCrypto()

const { data } = useFetch('/api/user/watchlist')

const userWatchlist = computed(() => {
  return data.value?.map((crypto) => crypto.cryptoId)
})

const cryptos = computed(() => {
  return publicCryptos.value.filter((crypto) => userWatchlist.value?.includes(crypto.id))
})
</script>

<template>
  <div class="grid grid-cols-1 gap-4">
    <ChartCryptoCard v-for="(crypto, index) in cryptos.slice(0, 12)" :key="crypto.name" :crypto-item="crypto" :index />
  </div>
</template>

