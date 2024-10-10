<script setup lang="ts">
import { MoonIcon, SunIcon, ComputerDesktopIcon } from '@heroicons/vue/24/outline'
import { capitalize } from '~/composables/useString'

defineProps({
  isText: {
    type: Boolean,
    default: false,
  },
})

const themes = ['system', 'light', 'dark']
</script>

<template>
  <USelectMenu v-model="$colorMode.preference" :options="themes" class="cursor-pointer">
    <template #label>
      <div class="flex items-center gap-2">
        <component :is="$colorMode.value === 'light' ? SunIcon : MoonIcon" class="size-4" />
        <span v-if="isText" class="text-xs font-semibold">{{ capitalize($colorMode.preference) }}</span>
      </div>
    </template>
    <template #option="{ option }">
      <div class="flex cursor-pointer items-center gap-2">
        <component :is="option === 'light' ? SunIcon : option === 'dark' ? MoonIcon : ComputerDesktopIcon" class="size-4" />
        <span v-if="isText" class="text-xs font-semibold">{{ capitalize(option) }}</span>
      </div>
    </template>
  </USelectMenu>
</template>
