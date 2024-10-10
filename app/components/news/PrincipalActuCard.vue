<script setup lang="ts">
import type { PropType } from 'vue'
import type { Article } from '~/types/Article'

defineProps({
  article: {
    type: Object as PropType<Article>,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
})
</script>

<template>
  <NuxtLink
    class="black:hover:bg-neutral-50/50 h-1/3 w-full cursor-pointer gap-2 rounded-xl border-none p-4 transition-colors duration-300 hover:bg-neutral-950/10 lg:rounded-r-xl"
    :class="active ? 'bg-neutral-950/10 dark:bg-neutral-50/10' : ''"
    :to="article.link"
  >
    <div class="w-full">
      <span class="text-lg font-semibold text-gray-700 dark:text-gray-200">{{ article.title }}</span>
    </div>
    <div class="size-full">
      <span ref="description" class="description max-h-14 text-sm text-gray-500 lg:max-h-20 dark:text-gray-400">
        {{ article.description }}
      </span>
    </div>
  </NuxtLink>
</template>

<style scoped lang="scss">
.description {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
