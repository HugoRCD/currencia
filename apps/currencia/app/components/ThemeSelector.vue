<script setup lang="ts">
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
        <UIcon :name="$colorMode.value === 'light' ? 'lucide:sun' : 'lucide:moon'" class="size-4" />
        <span v-if="isText" class="text-xs font-semibold">{{ capitalize($colorMode.preference) }}</span>
      </div>
    </template>
    <template #option="{ option }">
      <div class="flex cursor-pointer items-center gap-2">
        <UIcon :name="option === 'light' ? 'lucide:sun' : option === 'dark' ? 'lucide:moon' : 'lucide:computer'" class="size-4" />
        <span v-if="isText" class="text-xs font-semibold">{{ capitalize(option) }}</span>
      </div>
    </template>
  </USelectMenu>
</template>
