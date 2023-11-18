<script setup lang="ts">
const timeframes = [
  {
    name: "1D",
    value: "1d",
    series: getTodayHours(),
  },
  {
    name: "1W",
    value: "1w",
    series: getCurrentWeek(),
  },
  {
    name: "1M",
    value: "1m",
    series: getCurrentMonth(),
  },
  {
    name: "3M",
    value: "3m",
    series: getCurrent3Months(),
  },
  {
    name: "6M",
    value: "6m",
    series: getCurrent6Months(),
  },
  {
    name: "1Y",
    value: "1y",
    series: getCurrentYear(),
  },
];

const selectedTimeframe = ref(timeframes[0].value);

const emit = defineEmits(["update:timeframe"]);

watch(selectedTimeframe, (value) => {
  const timeframe = timeframes.find((timeframe) => timeframe.value === value);
  emit("update:timeframe", timeframe!.series);
});
</script>

<template>
  <div class="flex flex-row items-center gap-3">
    <div v-for="timeframe in timeframes" :key="timeframe.name">
      <button
        :class="{
          'bg-gray-200 dark:bg-gray-700': selectedTimeframe === timeframe.value,
          'bg-white dark:bg-gray-800': selectedTimeframe !== timeframe.value,
        }"
        class="timeframe"
        @click="selectedTimeframe = timeframe.value"
      >
        {{ timeframe.name }}
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
