<script setup lang="ts">
import type { TimeFrame } from "~/types/ApexChart";

const timeframes = [
  {
    value: "1W",
    series: getLastWeek(),
  },
  {
    value: "1M",
    series: getLastMonth(),
  },
  {
    value: "3M",
    series: getLast3Months(),
  },
  {
    value: "6M",
    series: getLast6Months(),
  },
  {
    value: "1Y",
    series: getLastYear(),
  },
] as TimeFrame[];

const selectedTimeframe = ref<TimeFrame>(timeframes[2]);

const emit = defineEmits(["update:timeframe"]);

function selectNewTimeframe(timeframe: TimeFrame) {
  selectedTimeframe.value = timeframe;
  emit("update:timeframe", timeframe);
}
</script>

<template>
  <div class="flex flex-row items-center gap-1 sm:gap-5">
    <div v-for="timeframe in timeframes" :key="timeframe.value">
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

<style scoped lang="scss">
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
