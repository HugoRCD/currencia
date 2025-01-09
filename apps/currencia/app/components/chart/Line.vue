<!-- eslint-disable -->
<script setup lang="ts">
import type { ApexOptions, TimeFrame, Variations } from '~~/types/ApexChart'
import {
  VisXYContainer,
  VisLine,
  VisAxis,
  VisArea,
  VisCrosshair,
  VisTooltip,
  VisAnnotations
} from '@unovis/vue'
import type { PriceDataRecord } from "~~/types/Crypto";

type ChartLineProps = {
  showTooltip?: boolean
  data: PriceDataRecord[]
}

const colorMode = useColorMode()
const dayjs = useDayjs()

const { showTooltip = false, data } = defineProps<ChartLineProps>()

const emit = defineEmits(['update:currentValue'])

const timeframe = ref<TimeFrame>({
  value: '6M',
  series: getLast6Months(),
})

const firstValue = computed(() => {
  const { start } = timeframe.value.series
  return data.find(d => dayjs(d.date).isSame(start, 'day'))?.price
})

const lastValue = computed(() => {
  const { end } = timeframe.value.series
  return data.find(d => dayjs(d.date).isSame(end, 'day'))?.price
})

const isPositive = computed(() => {
  if (!firstValue.value || !lastValue.value) return false
  return lastValue.value > firstValue.value
})

const price = ref(0)

function getVariation(start: number, end: number): Variations {
  if (start === 0) return { percent: 0, value: 0 }
  return {
    percent: ((end - start) / start) * 100,
    value: end - start,
  }
}

const chart = ref()
watch(price, () => {
  emit('update:currentValue', price.value ? price.value : lastValue.value)
}, { immediate: true })

const variations = defineModel<Variations>('variations')

function mouseOut() {
  emit('update:currentValue', lastValue.value)
  variations.value = getVariation(firstValue.value, lastValue.value)
}
mouseOut()

watch(timeframe, () => {
  const { start } = timeframe.value.series
  const { end } = timeframe.value.series
  chart.value.chart.zoomX(start, end)
  mouseOut()
})

const xTicks = (i: number) => {
  if (i === 0 || i === data.length - 1 || !data[i]) {
    return ''
  }

  return formatDate(data[i].date)
}
const x = (_: PriceDataRecord, i: number) => i
const y = (d: PriceDataRecord) => d.price

const template = (d: PriceDataRecord) => {
  price.value = d.price
  variations.value = getVariation(firstValue.value, d.price)
  return `${formatDate(d.date)}: ${d.price}$`
}
</script>

<template>
  <div class="relative select-none">
    {{ firstValue }}
    {{ lastValue }}
    <ChartTimeFrame @update:timeframe="timeframe = $event" />
    <div class="relative mt-4">
      <DotPattern />
      <VisXYContainer
        :data
        :padding="{ top: 10 }"
        class="h-80"
      >
        <VisLine :x :y color="rgb(var(--color-primary-DEFAULT))" :class="isPositive ? 'positive' : 'negative'" />
        <VisArea :x :y color="rgb(var(--color-primary-DEFAULT))" :class="isPositive ? 'positive' : 'negative'" :opacity="0.1" />

        <VisAxis type="x" :x :tick-format="xTicks" :grid-line="false" />

        <VisCrosshair color="rgb(var(--color-primary-DEFAULT))" :template />

        <VisTooltip />
      </VisXYContainer>
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

.unovis-xy-container {
  --vis-crosshair-line-stroke-color: rgb(var(--graph-curve));
  --vis-crosshair-circle-stroke-color: #fff;

  --vis-axis-grid-color: rgb(var(--color-gray-200));
  --vis-axis-tick-color: rgb(var(--color-gray-200));
  --vis-axis-tick-label-color: rgb(var(--color-gray-400));

  --vis-tooltip-background-color: #fff;
  --vis-tooltip-border-color: rgb(var(--color-gray-200));
  --vis-tooltip-text-color: rgb(var(--color-gray-900));

  --vis-annotation-text-color: rgb(var(--color-primary-500));
}

.dark {
  .unovis-xy-container {
    --vis-crosshair-line-stroke-color: rgb(var(--color-primary-400));
    --vis-crosshair-circle-stroke-color: rgb(var(--color-gray-900));

    --vis-axis-grid-color: rgb(var(--color-gray-800));
    --vis-axis-tick-color: rgb(var(--color-gray-800));
    --vis-axis-tick-label-color: rgb(var(--color-gray-500));

    --vis-tooltip-background-color: rgb(var(--color-gray-900));
    --vis-tooltip-border-color: rgb(var(--color-gray-800));
    --vis-tooltip-text-color: #fff;
    --vis-annotation-text-color: rgb(var(--color-primary-400));
  }
}
</style>
