<script setup lang="ts">
import type { ApexOptions, TimeFrame } from "~/types/ApexChart";
const colorMode = useColorMode();

const dayjs = useDayjs();

/*type TimeFrame = {
  value: string;
  series: {
    start: number; // timestamp
    end: number; // timestamp
  };
};*/

const timeframe = ref<TimeFrame>({
  value: "3M",
  series: getCurrent3Months(),
});

const firstTimeframeValue = computed(() => {
  const start = timeframe.value.series.start;
  const seriesData = series[0].data;

  for (let i = 0; i < seriesData.length; i++) {
    const dataPoint = seriesData[i];
    if (dataPoint.x >= start) {
      return dataPoint.y;
    }
  }

  return null; // Si aucune valeur n'est trouvée dans la plage de temps sélectionnée
});

const lastTimeframeValue = computed(() => {
  const end = timeframe.value.series.end;
  const seriesData = series[0].data;

  for (let i = seriesData.length - 1; i >= 0; i--) {
    const dataPoint = seriesData[i];
    if (dataPoint.x <= end) {
      return dataPoint.y;
    }
  }

  return null; // Si aucune valeur n'est trouvée dans la plage de temps sélectionnée
});

const series = [
  {
    data: getRandomDailyData(),
  },
];

const chart = ref();

const currentValue = ref("");

function updateTimeline() {
  const start = timeframe.value.series.start;
  const end = timeframe.value.series.end;
  chart.value.chart.zoomX(start, end);
}

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
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 0.1,
      opacityFrom: 0.6,
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
    borderColor: colorMode.value === "dark" ? "#2A2A2B" : "#E5E7EB",
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
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      const value = series[seriesIndex][dataPointIndex] as number;
      currentValue.value = value.toLocaleString();
      return "";
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

watch(timeframe, () => {
  updateTimeline();
});

watch(colorMode, () => {
  chart.value.chart.updateOptions({
    theme: {
      mode: colorMode.value,
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

const emit = defineEmits(["update:currentValue"]);

watch(currentValue, () => {
  emit("update:currentValue", currentValue.value);
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center">{{ firstTimeframeValue }} - {{ lastTimeframeValue }}</div>
    <ChartTimeFrame @update:timeframe="timeframe = $event" />
    <apexchart id="chart" ref="chart" height="300" type="area" :options="chartOptions" :series="series" />
  </div>
</template>

<style scoped lang="scss"></style>
