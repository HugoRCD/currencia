<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
    default: "",
  },
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-bold">
        {{ title }}
      </h1>
      <p class="text-gray-500 dark:text-gray-400 text-sm" v-if="description">
        {{ description }}
      </p>
    </div>
    <hr class="border-gray-300 dark:border-gray-700 border-1 rounded-lg w-full mx-auto mt-1 mb-3" />
    <div class="flex flex-col gap-4">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
