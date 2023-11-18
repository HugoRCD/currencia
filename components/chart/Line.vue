<script setup lang="ts">
import type { PropType } from "vue";
import type { ApexOptions } from "~/types/ApexChart";

const props = defineProps({
  series: {
    type: Object as PropType<{ data: number[] }>,
    required: true,
  },
  categories: {
    type: Array as PropType<string[]>,
    required: true,
  },
});

const timeframe = ref([]);

const chartOptions = ref({
  chart: {
    height: 350,
    type: "line",
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
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
    borderColor: "#eceeef",
  },
  markers: {
    size: 0,
  },
  xaxis: {
    type: "datetime",
    categories: props.categories,
  },
  yaxis: {
    labels: {
      formatter: function (val: number) {
        return val.toFixed(2);
      },
    },
    min: -1000,
    max: 1000,
  },
  tooltip: {
    x: {
      format: "dd/MM/yy HH:mm",
    },
  },
} satisfies ApexOptions);

const colors = computed(() => {
  const start = props.series.data[0];
  const end = props.series.data[props.series.data.length - 1];
  return start > end ? ["#EF4444"] : ["#10B981"];
});

onMounted(() => {});
</script>

<template>
  <div>
    <ChartTimeFrame @update:timeframe="timeframe = $event" />
    <apexchart type="line" :options="{ ...chartOptions, colors }" :series="[series]" />
  </div>
</template>

<style scoped lang="scss"></style>
