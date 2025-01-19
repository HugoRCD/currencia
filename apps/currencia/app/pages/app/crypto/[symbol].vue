<script setup lang="ts">
import NumberFlow from '@number-flow/vue'
import type { CryptoPrice } from '@prisma/client'
import type { Variations } from '~~/types/ApexChart'
import type { Crypto } from '~~/types/Crypto'

const cryptos = usePublicCrypto()
const { symbol } = useRoute().params as { symbol: string }

const crypto = cryptos.value.find((crypto: Crypto) => crypto.symbol === symbol) as Crypto & { prices: CryptoPrice[] }

if (!crypto) useRouter().push('/app/market')

const { data: stats, status } = await useFetch(`/api/crypto/${symbol}/stats`)

const ath = computed(() => stats.value?.allTimeHigh)
const weeklyPerformance = computed(() => stats.value?.weeklyChange)
const monthlyPerformance = computed(() => stats.value?.monthlyChange)
const volatility = computed(() => stats.value?.volatility)
const supportLevel = computed(() => stats.value?.supportLevel)
const resistanceLevel = computed(() => stats.value?.resistanceLevel)
const athTimestamp = computed(() => stats.value?.timestamp)

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

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
    <div style="--stagger: 4; --delay: 100ms" data-animate class="flex flex-col gap-4">
      <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200">
        Overview
      </h3>
      <p v-if="crypto.description" class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        {{ crypto.description }}
      </p>

      <div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <StatCard
          v-if="status !== 'pending'"
          title="All Time High"
          :value="ath ? displayNumberValue(ath) : 'N/A'"
          suffix="$"
          icon="lucide:trending-up"
          :tooltip="athTimestamp ? `Updated on ${formatDate(athTimestamp)}` : ''"
        />
        <StatCard
          v-if="status !== 'pending'"
          title="Weekly Change"
          :value="weeklyPerformance ? displayNumberValue(weeklyPerformance) : 'N/A'"
          suffix="%"
          icon="lucide:calendar"
          :status="weeklyPerformance && weeklyPerformance > 0 ? 'positive' : 'negative'"
        />
        <StatCard
          v-if="status !== 'pending'"
          title="Monthly Change"
          :value="monthlyPerformance ? displayNumberValue(monthlyPerformance) : 'N/A'"
          suffix="%"
          icon="lucide:calendar"
          :status="monthlyPerformance && monthlyPerformance > 0 ? 'positive' : 'negative'"
        />
        <StatCard
          v-if="status !== 'pending'"
          title="Volatility"
          :value="volatility ? displayNumberValue(volatility) : 'N/A'"
          suffix="%"
          icon="lucide:activity"
        />
        <StatCard
          v-if="status !== 'pending'"
          title="Support Level"
          :value="supportLevel ? displayNumberValue(supportLevel) : 'N/A'"
          suffix="$"
          icon="lucide:arrow-down"
        />
        <StatCard
          v-if="status !== 'pending'"
          title="Resistance Level"
          :value="resistanceLevel ? displayNumberValue(resistanceLevel) : 'N/A'"
          suffix="$"
          icon="lucide:arrow-up"
        />
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
