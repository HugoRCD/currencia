<script setup lang="ts">
import NumberFlow, { NumberFlowGroup } from '@number-flow/vue'
import type { CryptoPrice } from '@prisma/client'
import type { Crypto } from '~~/types/Crypto'

type CryptoCardProps = {
  cryptoItem: Crypto & { prices: CryptoPrice[] }
  index: number
}

const { cryptoItem, index } = defineProps<CryptoCardProps>()

const { crypto: _crypto } = usePrice(cryptoItem.symbol)

const crypto = reactive({
  name: cryptoItem.name,
  symbol: cryptoItem.symbol,
  logo: cryptoItem.logo,
})

const firstValue = computed(() => {
  const seriesData = cryptoItem.prices

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < seriesData.length; i++) {
    const dataPoint = seriesData[i]
    if (dataPoint && dataPoint.price) {
      return dataPoint.price
    }
  }
  return 0
})

const lastValue = computed(() => {
  const seriesData = cryptoItem.prices


  for (let i = seriesData.length - 1; i >= 0; i--) {
    const dataPoint = seriesData[i]
    if (dataPoint && dataPoint.price) {
      return dataPoint.price
    }
  }
  return 0
})

const isPositive = computed(() => {
  if (!firstValue.value || !lastValue.value) return false
  return lastValue.value > firstValue.value
})

const diff = computed(() => {
  return ((lastValue.value - firstValue.value) / firstValue.value) * 100
})
</script>

<template>
  <div
    class="relative flex cursor-pointer flex-col gap-3 overflow-hidden rounded-xl border border-inherit bg-white p-4 shadow-sm hover:border-gray-200 hover:bg-gray-100 hover:transition-all hover:duration-300 dark:border-gray-800 dark:bg-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-900"
    @click="$router.push(`/app/crypto/${crypto.symbol}`)"
  >
    <div class="absolute -bottom-3 -right-2">
      <span class="text-7xl font-bold text-gray-700/20 dark:text-gray-200/20">
        {{ index + 1 }}
      </span>
    </div>
    <div class="flex flex-row items-center gap-2">
      <img :src="crypto.logo" class="size-7" :alt="crypto.name">
      <span class="text-lg font-semibold text-gray-700 dark:text-gray-200">{{ crypto.name }}</span>
      <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">{{ crypto.symbol }}</span>
    </div>
    <div v-if="_crypto" class="flex flex-col gap-1">
      <div class="flex flex-row items-center">
        <NumberFlowGroup>
          <div style="--number-flow-char-height: 0.85em" class="flex flex-col gap-1 font-semibold">
            <NumberFlow
              :value="_crypto.price"
              suffix="$"
              :locales="['fr-FR']"
              continuous
              class="text-2xl font-semibold tabular-nums"
            />
            <NumberFlow
              :value="diff"
              suffix="%"
              :class="[
                'text-sm transition-colors duration-300',
                !isPositive ? 'text-red-500' : 'text-emerald-500'
              ]"
            />
          </div>
        </NumberFlowGroup>
      </div>
    </div>
    <div v-else class="flex flex-col gap-1">
      <USkeleton
        class="h-5 w-28"
        :ui="{
          background: 'bg-gray-50 dark:bg-gray-900'
        }"
      />
      <USkeleton
        class="h-4 w-20"
        :ui="{
          background: 'bg-gray-50 dark:bg-gray-900'
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.positive {
  @apply text-green-500;
  text-shadow: 0 0 0.5rem rgba(72, 187, 120, 0.2);
}

.negative {
  @apply text-red-500;
  text-shadow: 0 0 0.5rem rgba(239, 68, 68, 0.2);
}
</style>
