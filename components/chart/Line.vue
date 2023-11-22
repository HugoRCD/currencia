<script setup lang="ts">
import type { ApexOptions, TimeFrame } from "~/types/ApexChart";
import { getRandomDailyData } from "~/composables/useTime";
const colorMode = useColorMode();

const dayjs = useDayjs();

const timeframe = ref<TimeFrame>({
  value: "3M",
  series: getCurrent3Months(),
});

const series = [
  {
    data: getRandomDailyData(),
  },
];

const chart = ref();

function updateTimeline() {
  const start = timeframe.value.series.start;
  const end = timeframe.value.series.end;
  chart.value.chart.zoomX(start, end);
}

const chartOptions = {
  chart: {
    id: "area-datetime",
    type: "area",
    height: 350,
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
    background: "transparent",
  },
  theme: {
    mode: colorMode.value,
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  grid: {
    borderColor: "rgba(0,0,0,0.04)",
  },
  markers: {
    size: 0,
    style: "hollow",
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  xaxis: {
    type: "datetime",
    min: timeframe.value.series.start,
    tickAmount: 6,
  },
  tooltip: {
    x: {
      format: "dd/MM/yy HH:mm",
    },
  },
} satisfies ApexOptions;

watch(timeframe, () => {
  updateTimeline();
});

watch(colorMode, () => {
  chart.value.chart.updateOptions({
    theme: {
      mode: colorMode.value,
    },
  });
});
</script>

<template>
  <div>
    <ChartTimeFrame @update:timeframe="timeframe = $event" />
    <apexchart ref="chart" type="line" :options="chartOptions" :series="series" />
  </div>
</template>

<style scoped lang="scss"></style>
