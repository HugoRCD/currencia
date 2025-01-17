<script setup lang="ts">
import type { TimeFrame } from '~~/types/ApexChart'

type Props = {
  data: [number, number][]
  selectedTimeframe: TimeFrame
}

const props = defineProps<Props>()
const emit = defineEmits(['update:timeframe'])

// Fonction utilitaire pour calculer les timeframes dynamiques
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

  // Calculer les timeframes en fonction de la plage totale
  const now = Date.now()
  if (totalDuration >= 86400000) { // Plus d'un jour
    timeframes.push({
      value: '1D',
      start: now - 86400000,
      end: now
    })
  }

  if (totalDuration >= 604800000) { // Plus d'une semaine
    timeframes.push({
      value: '1W',
      start: now - 604800000,
      end: now
    })
  }

  if (totalDuration >= 2592000000) { // Plus d'un mois
    timeframes.push({
      value: '1M',
      start: now - 2592000000,
      end: now
    })
  }

  if (totalDuration >= 7776000000) { // Plus de 3 mois
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
  <div class="flex flex-row items-center gap-1 sm:gap-5">
    <div v-for="timeframe in availableTimeframes" :key="timeframe.value">
      <button
        :class="{
          'bg-gray-200 dark:bg-gray-700': selectedTimeframe.value === timeframe.value,
          'not-active': selectedTimeframe.value !== timeframe.value,
        }"
        class="timeframe"
        @click="selectNewTimeframe(timeframe)"
      >
        {{ timeframe.value }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.timeframe {
  @apply rounded-md;
  @apply text-gray-700 dark:text-gray-200;
  border-radius: 0.5rem;
  padding: 0.1rem 0.7rem;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &.not-active {
    opacity: 0.5;
  }
}
</style>
