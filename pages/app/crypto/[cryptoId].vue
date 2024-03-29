<script setup lang="ts">
import { displayNumberValue } from "~/types/ApexChart";
import type { Variations } from "~/types/ApexChart";
import type { Crypto } from "~/types/Crypto";
const cryptos = usePublicCrypto();

const cryptoId = useRoute().params.cryptoId;
const crypto = cryptos.value.find((crypto: Crypto) => crypto.symbol === cryptoId) as Crypto;
if (!crypto) {
  useRouter().push("/404");
}

const variations = ref<Variations>({
  percent: -1,
  value: -1,
});

const price = ref(crypto.data[crypto.data.length - 1][1]);
const series = crypto.data;
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
          <span class="text-4xl font-semibold text-gray-700 dark:text-gray-200">{{ displayNumberValue(price) }} $</span>
        </div>
        <div class="flex flex-row gap-2 items-center text-sm font-medium font-sans" :class="variations.value > 0 ? 'positive' : 'negative'">
          <div class="flex flex-row gap-1 items-center">
            <UIcon name="i-heroicons-arrow-down-circle-solid" class="w-5 h-5 transition-transform" :class="[variations.value > 0 && 'transform rotate-180']" />
            <span> {{ displayNumberValue(variations.value) }}$ </span>
          </div>
          <span class="text-xs"> ({{ displayNumberValue(variations.percent) }}%) </span>
        </div>
      </div>
    </div>
    <ChartLine
      style="--stagger: 3; --delay: 100ms"
      data-animate
      @update:currentValue="price = $event"
      :cryptoData="series"
      @update:variation="variations = $event"
    />
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
