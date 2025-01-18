<script setup lang="ts">
const cryptos = usePublicCrypto()
const { loggedIn } = useUserSession()

const series = {
  data: [],
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div v-if="!loggedIn">
      <UAlert
        icon="heroicons:information-circle"
        color="red"
        variant="soft"
        title="You are not logged in."
        description="Create an account to access the full features of the app."
      />
    </div>

    <Sentiments />

    <!-- Crypto -->
    <div style="--stagger: 1" data-animate class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      <ChartCryptoCard v-for="(crypto, index) in cryptos.slice(0, 12)" :key="crypto.name" :crypto-item="crypto" :index />
    </div>

    <!-- Overall Chart -->
    <div style="--stagger: 2" data-animate class="mt-8 flex flex-col gap-3">
      <h2 class="text-xl font-bold">
        Overall Market
      </h2>
      <!--      <ChartLine :series show-tooltip />-->
    </div>
  </div>
</template>

