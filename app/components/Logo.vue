<script setup lang="ts">
const { appName } = useAppConfig();
defineProps({
  isText: {
    type: Boolean,
    default: false,
  },
  size: {
    type: Number,
    default: 6,
  },
});
</script>

<template>
  <div id="main-logo">
    <NuxtLink to="/" class="flex flex-shrink-0 items-center" aria-label="Go back to home page">
      <SvgoHochardLogo :fontControlled="false" class="block text-black dark:text-white lg:hidden" :class="size ? 'h-' + size : 'h-6'" />
      <SvgoHochardLogo :fontControlled="false" class="hidden text-black dark:text-white lg:block" :class="size ? 'h-' + size : 'h-6'" />
      <span class="text-xs font-semibold ml-1" v-if="isText">{{ appName }}</span>
    </NuxtLink>
  </div>
</template>
