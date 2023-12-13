<script setup lang="ts">
import type { PropType } from "vue";
import type { Article } from "~/types/Article";

defineProps({
  article: {
    type: Object as PropType<Article>,
    required: true,
  },
});
</script>

<template>
  <NuxtLink
    class="relative overflow-hidden flex flex-col gap-2 rounded-xl shadow-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer"
    :to="article.link"
  >
    <div class="w-full h-[15rem]">
      <img :src="article.preview" class="w-full h-full object-cover" :alt="article.title" />
    </div>
    <div class="flex flex-col gap-1 p-4 pt-0">
      <div class="flex flex-row items-center">
        <span v-if="article" class="text-lg font-semibold text-gray-700 dark:text-gray-200">{{ article.title }}</span>
      </div>
      <div class="flex flex-row items-center">
        <span v-if="article" class="text-sm text-gray-500 dark:text-gray-400 description max-h-20" ref="description">
          {{ article.description }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped lang="scss">
.description {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
