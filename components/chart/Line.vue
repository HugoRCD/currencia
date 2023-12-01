<script setup lang="ts">
import type { ApexOptions, TimeFrame, Variations } from "~/types/ApexChart";
import { type ApexChartSeries, displayNumberValue } from "~/types/ApexChart";
import type { PropType } from "vue";
const colorMode = useColorMode();
const dayjs = useDayjs();

const props = defineProps({
  showTooltip: {
    type: Boolean,
    default: false,
  },
  cryptoData: {
    type: Array as PropType<ApexChartSeries["data"]>,
    required: false,
  },
});
const emit = defineEmits(["update:currentValue", "update:variation"]);

const timeframe = ref<TimeFrame>({
  value: "3M",
  series: getLast3Months(),
});

const firstValue = computed(() => {
  const start = timeframe.value.series.start;
  const seriesData = series[0].data;

  for (let i = 0; i < seriesData.length; i++) {
    const dataPoint = seriesData[i];
    if (dataPoint[0] >= start) {
      return dataPoint[1];
    }
  }
});

const lastValue = computed(() => {
  const end = timeframe.value.series.end;
  const seriesData = series[0].data;

  for (let i = seriesData.length - 1; i >= 0; i--) {
    const dataPoint = seriesData[i];
    if (dataPoint[0] <= end) {
      return dataPoint[1];
    }
  }
});

const isPositive = computed(() => {
  if (!firstValue.value || !lastValue.value) return false;
  return lastValue.value > firstValue.value;
});

const series = [
  {
    data: getRandomDailyData(),
  },
];

const price = ref(0);

function getVariation(start: number, end: number): Variations {
  if (start === 0) return { percent: 0, value: 0 };
  return {
    percent: ((end - start) / start) * 100,
    value: end - start,
  };
}

const variation = computed(() => {
  return getVariation(firstValue.value, price.value);
});

const chart = ref();

watch(colorMode, () => {
  chart.value.chart.updateOptions({
    theme: {
      mode: colorMode.value,
    },
    fill: {
      gradient: {
        shade: colorMode.value,
        opacityFrom: colorMode.value === "dark" ? 0.6 : 0,
      },
    },
    grid: {
      borderColor: colorMode.value === "dark" ? "#2A2A2B" : "#E5E7EB",
    },
    xaxis: {
      labels: {
        style: {
          colors: colorMode.value === "dark" ? "#9CA3AF" : "#4B5563",
        },
      },
    },
  });
});

watch(
  price,
  () => {
    emit("update:currentValue", price.value ? price.value : lastValue.value);
  },
  { immediate: true },
);

watch(
  variation,
  () => {
    emit("update:variation", variation.value);
  },
  { immediate: true },
);

function mouseOut() {
  emit("update:currentValue", lastValue.value);
  emit("update:variation", getVariation(firstValue.value, lastValue.value));
}
mouseOut();

watch(timeframe, () => {
  const start = timeframe.value.series.start;
  const end = timeframe.value.series.end;
  chart.value.chart.zoomX(start, end);
  mouseOut();
});

const chartOptions = {
  chart: {
    id: "area-datetime",
    type: "area",
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
  plotOptions: {
    area: {
      fillTo: "end",
    },
  },
  colors: ["var(--graph-curve)"],
  fill: {
    type: "gradient",
    gradient: {
      shade: colorMode.value,
      shadeIntensity: 0.1,
      opacityFrom: colorMode.value === "dark" ? 0.6 : 0,
      opacityTo: 0,
      stops: [0, 90, 100],
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  grid: {
    borderColor: colorMode.value === "dark" ? "#2A2A2B" : "#f2f3f4",
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
    tickAmount: 5,
    labels: {
      style: {
        colors: colorMode.value === "dark" ? "#9CA3AF" : "#4B5563",
      },
      formatter: function (value) {
        return dayjs(value).format("DD.MM");
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  tooltip: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    custom: function ({ series, seriesIndex, dataPointIndex }) {
      const value = series[seriesIndex][dataPointIndex] as number;
      price.value = value;
      if (!props.showTooltip) return "";
      return `<div class="px-4 py-1"><span>${displayNumberValue(value)}$</span></div>`;
    },
    x: {
      format: "dd/MM/yy HH:mm",
      formatter: function (value) {
        return dayjs(value).format("DD.MM.YYYY");
      },
    },
    y: {
      title: {
        formatter: function () {
          return "";
        },
      },
      formatter: function (value: number) {
        return value.toFixed(2);
      },
    },
  },
} satisfies ApexOptions;
</script>

<template>
  <div class="select-none">
    <ChartTimeFrame @update:timeframe="timeframe = $event" />
    <apexchart
      id="chart"
      ref="chart"
      height="300"
      type="area"
      :options="chartOptions"
      :series="series"
      @mouseout="mouseOut"
      :class="isPositive ? 'positive' : 'negative'"
    />
  </div>
</template>

<style scoped lang="scss">
.positive {
  --graph-curve: #10b981;
}

.negative {
  --graph-curve: #ef4444;
}
</style>
