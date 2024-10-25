<script setup lang="ts">
const { appName } = useAppConfig()
defineProps({
  isText: {
    type: Boolean,
    default: false,
  },
  size: {
    type: Number,
    default: 6,
  },
})
</script>

<template>
  <div id="main-logo">
    <NuxtLink to="/" class="flex flex-shrink-0 items-center" aria-label="Go back to home page">
      <SvgoHochardLogo :font-controlled="false" class="block text-black lg:hidden dark:text-white" :class="size ? 'h-' + size : 'h-6'" />
      <SvgoHochardLogo :font-controlled="false" class="hidden text-black lg:block dark:text-white" :class="size ? 'h-' + size : 'h-6'" />
      <span v-if="isText" class="ml-1 text-xs font-semibold">{{ appName }}</span>
    </NuxtLink>
  </div>
</template>
