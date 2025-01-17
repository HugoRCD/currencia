<script setup lang="ts">
import dayjs from 'dayjs'
import type { Classification } from '@prisma/client'

const { data, status } = useFetch('/api/sentiments')

const filledData = computed(() => {
  if (!data.value) return Array.from({ length: 30 }, () => ({ date: '', value: -1 }))
  const last30Days = data.value.slice(0, 30)
  const filled = Array.from({ length: 30 }, (_, i) => {
    const date = dayjs().subtract(i, 'day').format('DD/MM/YYYY')
    const found = last30Days.find((item) => dayjs(item.date).format('DD/MM/YYYY') === date)
    return found || { date, value: -1 }
  })
  return filled.reverse()
})

const lastMessage = computed(() => {
  if (!data.value || !data.value[0]) return ''
  return data.value[0].message
})

const lastClassification = computed<Classification>(() => {
  if (!data.value || !data.value[0]) return 'NEUTRAL'
  return data.value[0].classification
})

function color(value: number) {
  if (value === -1) return 'bg-neutral-200 dark:bg-neutral-800'
  if (value > 75) return 'bg-green-600'
  if (value > 50) return 'bg-orange-600'
  return 'bg-red-600'
}

function getClassification(value: Classification) {
  if (value === 'EXTREMELY_BULLISH') return 'Extremely Bullish'
  if (value === 'BULLISH') return 'Bullish'
  if (value === 'NEUTRAL') return 'Neutral'
  if (value === 'BEARISH') return 'Bearish'
  if (value === 'EXTREMELY_BEARISH') return 'Extremely Bearish'
}
</script>

<template>
  <div v-if="status !== 'pending'">
    <div class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">
        Sentiments Analysis
      </h2>
      <div class="flex flex-row items-center gap-2">
        <span class="text-gray-500 dark:text-gray-400">
          {{ lastMessage }}
        </span>
      </div>
      <div class="flex flex-wrap items-center gap-1">
        <div v-for="item in filledData" :key="item.date">
          <div :class="color(item.value)" class="h-6 w-1 rounded-sm" />
        </div>
        <span class="text-gray-500 dark:text-gray-400">
          {{ getClassification(lastClassification) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
