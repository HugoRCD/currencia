<script setup lang="ts">
import type { TimeFrame } from "~/types/ApexChart";

const timeframes = [
  {
    value: "1W",
    series: getCurrentWeek(),
  },
  {
    value: "1M",
    series: getCurrentMonth(),
  },
  {
    value: "3M",
    series: getCurrent3Months(),
  },
  {
    value: "6M",
    series: getCurrent6Months(),
  },
  {
    value: "1Y",
    series: getCurrentYear(),
  },
] as TimeFrame[];

const selectedTimeframe = ref<TimeFrame>(timeframes[2]);

const emit = defineEmits(["update:timeframe"]);

watch(selectedTimeframe, (value) => {
  const timeframe = timeframes.find((timeframe) => timeframe.value === value.value);
  emit("update:timeframe", timeframe);
});
</script>

<template>
  <div class="flex flex-row items-center gap-1">
    <div v-for="timeframe in timeframes" :key="timeframe.value">
      <button
        :class="{
          'bg-gray-200 dark:bg-gray-700': selectedTimeframe.value === timeframe.value,
          'bg-white dark:bg-gray-800': selectedTimeframe.value !== timeframe.value,
        }"
        class="timeframe"
        @click="selectedTimeframe = timeframe"
      >
        {{ timeframe.value }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.timeframe {
  @apply rounded-md px-[0.75rem] py-[3px];
  @apply text-gray-700 dark:text-gray-200;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
</style>
