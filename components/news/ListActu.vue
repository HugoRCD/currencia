<script setup lang="ts">
import type { Article } from "~/types/Article";
import type { PropType } from "vue";

defineProps({
  articles: {
    type: Array as PropType<Article[]>,
    required: true,
  },
});
</script>

<template>
  <div class="flex flex-col gap-3">
    <h2 class="text-xl font-bold">Recently in the crypto sphere</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NewsCardActu v-for="(article, index) in articles" :key="index" :article="article" :index="index" />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
