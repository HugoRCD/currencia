<script setup lang="ts">
import NumberFlow from '@number-flow/vue'
import type { CryptoPrice } from '@prisma/client'
import type { Variations } from '~~/types/ApexChart'
import type { Crypto } from '~~/types/Crypto'

const cryptos = usePublicCrypto()
const { symbol } = useRoute().params as { symbol: string }

const crypto = cryptos.value.find((crypto: Crypto) => crypto.symbol === symbol) as Crypto & { prices: CryptoPrice[] }

if (!crypto) useRouter().push('/app/market')

const { data: ath, status } = useFetch(`/api/crypto/${symbol}/ath`, { method: 'GET' })

const variations = ref<Variations>({
  percent: -1,
  value: -1,
})

const { crypto: _crypto, isLoading } = usePrice(symbol)

const isHovered = ref(false)

function formatData(data: CryptoPrice[]) {
  return data.map((price) => {
    return [
      Number(price.timestamp),
      price.price
    ] as [number, number]
  })
}

const data = ref(formatData(crypto.prices))

/*watch(_crypto, (value) => {
  if (value) {
    data.value.push([+_crypto.value.timestamp, _crypto.value.price])
    data.value.sort((a, b) => a[0] - b[0])
  }
})*/
</script>

<template>
  <div v-if="crypto && _crypto" class="flex flex-col gap-8">
    <div class="flex flex-col gap-4">
      <div style="--stagger: 1; --delay: 100ms" data-animate class="flex flex-row items-center gap-3">
        <img :src="crypto.logo" class="size-7" :alt="crypto.name">
        <h1 class="text-2xl font-bold text-gray-700 dark:text-gray-200">
          {{ crypto.name }}
        </h1>
      </div>
      <div style="--stagger: 2; --delay: 100ms" data-animate class="flex flex-col gap-2">
        <div class="flex flex-row items-center">
          <span class="text-4xl font-semibold text-gray-700 dark:text-gray-200">
            <NumberFlow
              v-if="!isLoading"
              :value="_crypto.price"
              suffix="$"
              :locales="['fr-FR']"
              :format="{ maximumFractionDigits: 2 }"
              continuous
              class="font-semibold tabular-nums"
            />
            <USkeleton v-else class="h-6 w-28" />
          </span>
        </div>

        <div class="flex flex-row items-center gap-2 font-sans text-sm font-medium" :class="variations.value > 0 ? 'positive' : 'negative'">
          <div class="flex flex-row items-center gap-1">
            <UIcon name="lucide:circle-arrow-down" class="size-5 transition-transform" :class="[variations.value > 0 && 'rotate-180 transform']" />
            <span> {{ displayNumberValue(variations.value) }}$ </span>
          </div>
          <span class="text-xs"> ({{ displayNumberValue(variations.percent) }}%) </span>
        </div>
      </div>
    </div>
    <ChartLine
      v-model="data"
      style="--stagger: 3; --delay: 100ms"
      data-animate
      @update:current-value="_crypto.price = $event"
      @update:variation="variations = $event"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    />
    <div v-if="crypto.description" style="--stagger: 4; --delay: 100ms" data-animate class="flex flex-col gap-2">
      <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200">
        Overview
      </h3>
      <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        {{ crypto.description }}
      </p>
      <div class="mt-4 grid grid-cols-2 gap-2">
        <div class="flex flex-col gap-1 rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">
            ATH
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ ath ? displayNumberValue(ath.value) : 'N/A' }}$
          </span>
        </div>
      </div>
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
  text-shadow: 0 0 0.5rem rgba(245, 101, 101, 0.2);
}

</style>
