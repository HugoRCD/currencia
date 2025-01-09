<script setup lang="ts">
import type { PriceDataRecord } from '~~/types/Crypto'

const cryptos = usePublicCrypto()
const { loggedIn } = useUserSession()

const { data } = await useAsyncData<PriceDataRecord[]>(async () => {
  const dates = ['2024-01-01', '2024-02-02', '2024-03-03', '2024-03-04', '2024-04-05']

  const min = 1000
  const max = 10000

  return dates.map(date => ({ date, price: Math.floor(Math.random() * (max - min + 1)) + min }))
}, {
  watch: [],
  default: () => []
})
</script>

<template>
  <div>
    <div v-if="!loggedIn" class="mb-4">
      <UAlert
        icon="heroicons:information-circle"
        color="rose"
        variant="soft"
        title="You are not logged in."
        description="Create an account to access the full features of the app."
      />
    </div>

    <!-- Crypto -->
    <div style="--stagger: 1" data-animate class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      <ChartCryptoCard v-for="(crypto, index) in cryptos.slice(0, 12)" :key="crypto.name" :crypto-item="crypto" :index />
    </div>

    <!-- Overall Chart -->
    <div style="--stagger: 2" data-animate class="mt-8 flex flex-col gap-3">
      <h2 class="text-xl font-bold">
        Overall Market
      </h2>
      <ChartLine v-if="data" :data show-tooltip />
    </div>
  </div>
</template>

