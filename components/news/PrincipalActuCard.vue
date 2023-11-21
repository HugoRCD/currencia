<script setup lang="ts">
import type { Article } from "~/types/Article";
import type { PropType } from "vue";

defineProps({
  article: {
    type: Object as PropType<Article>,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
});
</script>

<template>
  <div
    class="lg:rounded-tr-xl lg:rounded-br-xl rounded-xl border-none hover:bg-neutral-950/10 black:hover:bg-neutral-50/50 transition-colors duration-300 w-full flex-1 p-4 cursor-pointer gap-2"
    :class="active ? 'bg-neutral-950/10 dark:bg-neutral-50/10' : ''"
  >
    <div class="w-full">
      <span class="text-lg font-semibold text-gray-700 dark:text-gray-200">{{ article.title }}</span>
    </div>
    <div class="w-full h-full">
      <span class="text-sm text-gray-500 dark:text-gray-400 description max-h-20" ref="description">
        {{ article.description }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.description {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
