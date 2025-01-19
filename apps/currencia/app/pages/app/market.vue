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
      <ChartCryptoCard v-for="(crypto, index) in cryptos" :key="crypto.name" :crypto-item="crypto" :index />
    </div>
  </div>
</template>

