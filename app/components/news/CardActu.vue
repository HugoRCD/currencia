<script setup lang="ts">
import type { PropType } from 'vue'
import type { Article } from '~/types/Article'

defineProps({
  article: {
    type: Object as PropType<Article>,
    required: true,
  },
})
</script>

<template>
  <NuxtLink
    class="relative flex cursor-pointer flex-col gap-2 overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
    :to="article.link"
  >
    <div class="h-[15rem] w-full">
      <img :src="article.preview" class="size-full object-cover" :alt="article.title">
    </div>
    <div class="flex flex-col gap-1 p-4 pt-0">
      <div class="flex flex-row items-center">
        <span v-if="article" class="text-lg font-semibold text-gray-700 dark:text-gray-200">{{ article.title }}</span>
      </div>
      <div class="flex flex-row items-center">
        <span v-if="article" ref="description" class="description max-h-20 text-sm text-gray-500 dark:text-gray-400">
          {{ article.description }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.description {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
