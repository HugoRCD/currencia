<script setup lang="ts">
import type { ApexOptions, TimeFrame } from "~/types/ApexChart";
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
      return '<div class="px-4 py-1">' + "<span>" + series[seriesIndex][dataPointIndex] + "</span>" + "</div>";
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
</script>

<template>
  <div>
    <ChartTimeFrame @update:timeframe="timeframe = $event" />
    <apexchart id="chart" ref="chart" height="300" type="area" :options="chartOptions" :series="series" />
  </div>
</template>

<style scoped lang="scss"></style>
