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
  const totalDuration = maxTimestamp - minTimestamp

  const timeframes: TimeFrame[] = [
    {
      value: 'Auto',
      start: minTimestamp,
      end: maxTimestamp
    }
  ]

  const now = Date.now()
  if (totalDuration >= 86400000) { // More than a day
    timeframes.push({
      value: '1D',
      start: now - 86400000,
      end: now
    })
  }

  if (totalDuration >= 604800000) { // More than a week
    timeframes.push({
      value: '1W',
      start: now - 604800000,
      end: now
    })
  }

  if (totalDuration >= 2592000000) { // More than a month
    timeframes.push({
      value: '1M',
      start: now - 2592000000,
      end: now
    })
  }

  if (totalDuration >= 7776000000) { // More than 3 months
    timeframes.push({
      value: '3M',
      start: now - 7776000000,
      end: now
    })
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
