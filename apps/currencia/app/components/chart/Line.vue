<!-- eslint-disable -->
<script setup lang="ts">
import type { ApexOptions, TimeFrame, Variations } from '~~/types/ApexChart'

type ChartLineProps = {
  showTooltip?: boolean
  data: [number, number][]
}

const colorMode = useColorMode()
const dayjs = useDayjs()

const { showTooltip = false, data } = defineProps<ChartLineProps>()
const emit = defineEmits(['update:currentValue', 'update:variation'])

const firstValue = computed(() => {
  const seriesData = data

  for (let i = 0; i < seriesData.length; i++) {
    const dataPoint = seriesData[i]
    if (dataPoint && dataPoint[1]) {
      return dataPoint[1]
    }
  }
  return 0
})

const lastValue = computed(() => {
  const seriesData = data

  for (let i = seriesData.length - 1; i >= 0; i--) {
    const dataPoint = seriesData[i]
    if (dataPoint && dataPoint[1]) {
      return dataPoint[1]
    }
  }
  return 0
})

const isPositive = computed(() => {
  if (!firstValue.value || !lastValue.value) return false
  return lastValue.value > firstValue.value
})

const selectedTimeframe = ref<TimeFrame>({
  value: 'Auto',
  start: 0,
  end: 0
})

function getTimeframeFromData(data: [number, number][]): {
  format: string;
  tickAmount: number;
} {
  if (!data.length) {
    return { format: 'DD.MM HH:mm', tickAmount: 5 }
  }

  const timestamps = data.map(([timestamp]) => timestamp)
  const minDate = dayjs(Math.min(...timestamps))
  const maxDate = dayjs(Math.max(...timestamps))
  const diffDays = maxDate.diff(minDate, 'day')

  if (diffDays < 1) {
    return { format: 'HH:mm', tickAmount: 6 }
  } else if (diffDays < 7) {
    return { format: 'DD.MM HH:mm', tickAmount: 5 }
  } else if (diffDays < 31) {
    return { format: 'DD.MM', tickAmount: 7 }
  } else if (diffDays < 365) {
    return { format: 'MMM YYYY', tickAmount: 6 }
  } else {
    return { format: 'YYYY', tickAmount: 5 }
  }
}

const timeframeFormat = computed(() => getTimeframeFromData(data))

const series = [{ data }]

const price = ref(0)

function getVariation(start: number, end: number): Variations {
  if (start === 0) return { percent: 0, value: 0 }
  return {
    percent: ((end - start) / start) * 100,
    value: end - start,
  }
}

const variation = computed(() => {
  return getVariation(firstValue.value, price.value)
})

const chart = ref()

watch(colorMode, () => {
  chart.value.chart.updateOptions({
    theme: {
      mode: colorMode.value,
    },
    fill: {
      gradient: {
        shade: colorMode.value,
        opacityFrom: colorMode.value === 'dark' ? 0.6 : 0,
      },
    },
    grid: {
      borderColor: colorMode.value === 'dark' ? '#2A2A2B' : '#E5E7EB',
    },
    xaxis: {
      type: 'datetime',
      min: selectedTimeframe.value.start || undefined,
      max: selectedTimeframe.value.end || undefined,
      tickAmount: timeframeFormat.value.tickAmount,
      labels: {
        style: {
          colors: colorMode.value === 'dark' ? '#9CA3AF' : '#4B5563',
        },
        formatter: function(value) {
          return dayjs(value).format(timeframeFormat.value.format)
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
  })
})

function updateTimeframe(newTimeframe: TimeFrame) {
  selectedTimeframe.value = newTimeframe
  if (chart.value) {
    chart.value.chart.updateOptions({
      xaxis: {
        min: newTimeframe.start || undefined,
        max: newTimeframe.end || undefined,
      }
    })
  }
}

watch(price, () => {
  emit('update:currentValue', price.value ? price.value : lastValue.value)
})

watch(variation, () => {
  emit('update:variation', variation.value)
}, { immediate: true })

function mouseOut() {
  emit('update:variation', getVariation(firstValue.value, lastValue.value))
}
mouseOut()

const chartOptions = {
  chart: {
    id: 'area-datetime',
    type: 'area',
    zoom: {
      enabled: false,
    },
    animations: {
      enabled: true,
      easing: 'linear',
      dynamicAnimation: {
        speed: 1000
      }
    },
    toolbar: {
      show: false,
    },
    background: 'transparent',
  },
  theme: {
    mode: colorMode.value,
  },
  plotOptions: {
    area: {
      fillTo: 'end',
    },
  },
  colors: ['var(--graph-curve)'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: colorMode.value,
      shadeIntensity: 0.1,
      opacityFrom: colorMode.value === 'dark' ? 0.6 : 0,
      opacityTo: 0,
      stops: [0, 90, 100],
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  grid: {
    show: false,
    borderColor: colorMode.value === 'dark' ? '#2A2A2B' : '#f2f3f4',
  },
  markers: {
    size: 0,
    style: 'hollow',
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  xaxis: {
    type: 'datetime',
    // min: timeframe.value.series.start,
    tickAmount: 5,
    labels: {
      style: {
        colors: colorMode.value === 'dark' ? '#9CA3AF' : '#4B5563',
      },
      formatter: function(value) {
        return dayjs(value).format('DD.MM HH:mm')
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
    custom: function({ series, seriesIndex, dataPointIndex }) {
      const value = series[seriesIndex][dataPointIndex] as number
      price.value = value
      if (!showTooltip) return ''
      return `<div class="px-4 py-1"><span>${displayNumberValue(value)}$</span></div>`
    },
    x: {
      format: 'dd/MM/yy HH:mm',
      formatter: function(value) {
        return dayjs(value).format('DD.MM.YYYY')
      },
    },
    y: {
      title: {
        formatter: function() {
          return ''
        },
      },
      formatter: function(value: number) {
        return value.toFixed(2)
      },
    },
  },
} satisfies ApexOptions
</script>

<template>
  <div class="relative select-none">
    <!--    <ChartTimeFrame @update:timeframe="timeframe = $event" />-->
    <ChartTimeFrame
      :data
      :selected-timeframe
      @update:timeframe="updateTimeframe"
    />
    <div class="relative">
      <DotPattern />
      <apexchart
        id="chart"
        ref="chart"
        height="300"
        type="area"
        :options="chartOptions"
        :series
        :class="isPositive ? 'positive' : 'negative'"
        @mouseout="mouseOut"
      />
    </div>
  </div>
</template>

<style scoped>
.positive {
  --graph-curve: #10b981;
}

.negative {
  --graph-curve: #ef4444;
}
</style>
