<script setup lang="ts">
import { cryptos } from "~/data/crypto";
const cryptoId = useRoute().params.cryptoId;
const crypto = cryptos.find((crypto) => crypto.symbol === cryptoId);

function getRandomInt(min: number, max: number = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const price = getRandomInt(20000, 33000);
const variation = getRandomInt(-30, 30);
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-4">
      <div style="--stagger: 1; --delay: 100ms" data-animate class="flex flex-row items-center gap-3">
        <img :src="crypto.logo" class="w-7 h-7" :alt="crypto.name" />
        <h1 class="text-2xl font-bold text-gray-700 dark:text-gray-200" :key="crypto">{{ crypto.name }}</h1>
      </div>
      <div style="--stagger: 2; --delay: 100ms" data-animate class="flex flex-col gap-2">
        <div class="flex flex-row items-center">
          <span class="text-4xl font-semibold text-gray-700 dark:text-gray-200">{{ price.toLocaleString() }}</span>
          <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">$</span>
        </div>
        <div class="flex flex-row items-center">
          <span :class="variation > 0 ? 'positive' : 'negative'" class="text-sm font-semibold"> {{ variation.toLocaleString() }}% </span>
        </div>
      </div>
    </div>
    <ChartLine style="--stagger: 3; --delay: 100ms" data-animate />
    <div style="--stagger: 4; --delay: 100ms" data-animate v-if="crypto.description" class="flex flex-col gap-2">
      <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Overview</h3>
      <p class="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">{{ crypto.description }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.positive {
  @apply text-green-500;
  text-shadow: 0 0 0.5rem rgba(72, 187, 120, 0.2);
}

.negative {
  @apply text-red-500;
  text-shadow: 0 0 0.5rem rgba(245, 101, 101, 0.2);
}
</style>
