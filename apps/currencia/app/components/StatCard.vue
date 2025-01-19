<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  suffix: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'neutral'
  },
  tooltip: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="select-none rounded-lg bg-gray-800/80 p-4 transition-all hover:bg-gray-800">
    <UTooltip v-if="tooltip" :text="tooltip">
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-400">{{ title }}</span>
          <UIcon :name="icon" class="size-4 text-gray-500" />
        </div>
        <div class="flex items-baseline gap-1">
          <span
            class="text-xl font-semibold"
            :class="{
              'text-gray-200': status === 'neutral',
              'text-green-500': status === 'positive',
              'text-red-500': status === 'negative'
            }"
          >
            {{ value }}{{ suffix }}
          </span>
        </div>
      </div>
    </UTooltip>

    <div v-else class="flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-gray-400">{{ title }}</span>
        <UIcon :name="icon" class="size-4 text-gray-500" />
      </div>
      <div class="flex items-baseline gap-1">
        <span
          class="text-xl font-semibold"
          :class="{
            'text-gray-200': status === 'neutral',
            'text-green-500': status === 'positive',
            'text-red-500': status === 'negative'
          }"
        >
          {{ value }}{{ suffix }}
        </span>
      </div>
    </div>
  </div>
</template>
