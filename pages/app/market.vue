<script setup lang="ts">
const cryptos = usePublicCrypto();

const series = {
  data: [],
};

function smoothData(data: string | never[], windowSize: number) {
  const smoothedData = [];

  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    let count = 0;

    for (let j = Math.max(0, i - windowSize); j <= Math.min(data.length - 1, i + windowSize); j++) {
      sum += data[j];
      count++;
    }

    smoothedData.push(sum / count);
  }

  return smoothedData;
}

onMounted(() => {
  for (let i = 0; i < 50; i++) {
    const randomValue = Math.random() * 2000 - 1000;
    series.data.push(randomValue);
  }

  const windowSize = 5;
  series.data = smoothData(series.data, windowSize);
});
</script>

<template>
  <div>
    <div v-if="!useCurrentUser().value" class="mb-4">
      <UAlert
        icon="i-heroicons-information-circle"
        color="rose"
        variant="soft"
        title="You are not logged in."
        description="Create an account to access the full features of the app."
      />
    </div>

    <!-- Crypto -->
    <div style="--stagger: 1" data-animate class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <ChartCryptoCard v-for="(crypto, index) in cryptos.slice(0, 12)" :key="crypto.name" :cryptoItem="crypto" :index="index" />
    </div>

    <!-- Overall Chart -->
    <div style="--stagger: 2" data-animate class="flex flex-col gap-3 mt-8">
      <h2 class="text-xl font-bold">Overall Market</h2>
      <ChartLine :series="series" show-tooltip />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
