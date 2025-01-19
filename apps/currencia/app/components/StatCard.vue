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
  <UCard
    class="select-none rounded-lg"
    :ui="{
      body: {
        base: '',
        background: '',
        padding: 'px-4 py-5 sm:p-4'
      },
    }"
  >
    <UTooltip v-if="tooltip" :text="tooltip">
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-neutral-600 dark:text-neutral-400">{{ title }}</span>
          <UIcon :name="icon" class="size-4 text-neutral-500 dark:text-neutral-500" />
        </div>
        <div class="flex items-baseline gap-1">
          <span
            class="text-xl font-semibold"
            :class="{
              'text-neutral-800 dark:text-neutral-200': status === 'neutral',
              'text-green-600 dark:text-green-500': status === 'positive',
              'text-red-600 dark:text-red-500': status === 'negative'
            }"
          >
            {{ value }}{{ suffix }}
          </span>
        </div>
      </div>
    </UTooltip>

    <div v-else class="flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-neutral-600 dark:text-neutral-400">{{ title }}</span>
        <UIcon :name="icon" class="size-4 text-neutral-500 dark:text-neutral-500" />
      </div>
      <div class="flex items-baseline gap-1">
        <span
          class="text-xl font-semibold"
          :class="{
            'text-neutral-800 dark:text-neutral-200': status === 'neutral',
            'text-green-600 dark:text-green-500': status === 'positive',
            'text-red-600 dark:text-red-500': status === 'negative'
          }"
        >
          {{ value }}{{ suffix }}
        </span>
      </div>
    </div>
  </UCard>
</template>
