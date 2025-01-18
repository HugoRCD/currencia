<script setup lang="ts">
import type { TimeFrame } from '~~/types/ApexChart'

type Props = {
  data: [number, number][]
  selectedTimeframe: TimeFrame
}

const props = defineProps<Props>()
const emit = defineEmits(['update:timeframe'])

function calculateTimeframes(data: [number, number][]): TimeFrame[] {
  if (!data.length) return []

  const timestamps = data.map(([timestamp]) => timestamp)
  const minTimestamp = Math.min(...timestamps)
  const maxTimestamp = Math.max(...timestamps)
  const now = maxTimestamp

  const timeframes: TimeFrame[] = [
    {
      value: 'Auto',
      start: minTimestamp,
      end: maxTimestamp
    }
  ]

  const oneDay = 24 * 60 * 60 * 1000
  const periods = [
    { value: '1D', duration: oneDay },
    { value: '1W', duration: 7 * oneDay },
    { value: '1M', duration: 30 * oneDay },
    { value: '3M', duration: 90 * oneDay },
    { value: '1Y', duration: 365 * oneDay }
  ]

  for (const period of periods) {
    const potentialStart = now - period.duration
    if (potentialStart >= minTimestamp) {
      timeframes.push({
        value: period.value,
        start: potentialStart,
        end: now
      })
    }
  }

  return timeframes
}

const availableTimeframes = computed(() => calculateTimeframes(props.data))

function selectNewTimeframe(timeframe: TimeFrame) {
  emit('update:timeframe', timeframe)
}
</script>

<template>
  <div class="flex items-center gap-1">
    <span class="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
      Timeframe:
    </span>
    <div class="flex flex-row items-center gap-1 sm:gap-5">
      <div v-for="timeframe in availableTimeframes" :key="timeframe.value">
        <button
          :class="{
            'bg-neutral-200 dark:bg-neutral-700': selectedTimeframe.value === timeframe.value,
            'not-active': selectedTimeframe.value !== timeframe.value,
          }"
          class="timeframe rounded-md px-2 py-0.5 text-xs font-semibold transition-colors"
          @click="selectNewTimeframe(timeframe)"
        >
          {{ timeframe.value }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeframe {
  &.not-active {
    opacity: 0.5;
  }
}
</style>
