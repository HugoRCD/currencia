<script setup lang="ts">
import type { PropType } from "vue";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  item: {
    type: Object as PropType<{
      id: string;
      title: string;
      description: string;
      image: string;
    }>,
    required: true,
  },
});
</script>

<template>
  <div class="relative overflow-hidden flex flex-col gap-2 p-4 rounded-xl shadow-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
    <div>

    </div>
    <div class="flex flex-col gap-1">
      <div class="flex flex-row items-center">
        <span v-if="item" class="text-lg font-semibold text-gray-700 dark:text-gray-200">{{ item.title }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
