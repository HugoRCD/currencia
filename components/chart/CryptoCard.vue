<script setup lang="ts">
import type { PropType } from "vue";
import type { Crypto } from "~/data/crypto";

const props = defineProps({
  cryptoItem: {
    type: Object as PropType<Crypto>,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

function getRandomInt(min: number, max: number = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const crypto = reactive({
  name: props.cryptoItem.name,
  symbol: props.cryptoItem.symbol,
  logo: props.cryptoItem.logo,
  price: getRandomInt(120, 40000),
  change: getRandomInt(-100, 100),
});
</script>

<template>
  <div
    class="cursor-pointer relative overflow-hidden flex flex-col gap-2 p-4 rounded-xl shadow-sm bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 border border-inherit dark:border-gray-800 dark:hover:border-gray-700 hover:border-gray-200 transition-all duration-300"
    @click="$router.push(`/app/crypto/${crypto.symbol}`)"
  >
    <div class="absolute -bottom-3 -right-2">
      <span class="text-7xl font-bold text-gray-700/20 dark:text-gray-200/20">
        {{ index + 1 }}
      </span>
    </div>
    <img :src="crypto.logo" class="w-7 h-7" :alt="crypto.name" />
    <div class="flex flex-row items-center">
      <span class="text-lg font-semibold text-gray-700 dark:text-gray-200">{{ crypto.name }}</span>
      <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">{{ crypto.symbol }}</span>
    </div>
    <div class="flex flex-col gap-1">
      <div class="flex flex-row items-center">
        <span class="text-2xl font-semibold text-gray-700 dark:text-gray-200">{{ crypto.price }}</span>
        <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">$</span>
      </div>
      <div class="flex flex-row items-center">
        <span :class="crypto.change > 0 ? 'positive' : 'negative'" class="text-sm font-semibold"> {{ crypto.change }}% </span>
      </div>
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
  text-shadow: 0 0 0.5rem rgba(239, 68, 68, 0.2);
}
</style>
