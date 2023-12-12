<script setup lang="ts">
import { useArticle } from "~/composables/useArticle";

const articles = usePublicArticle();
const { loading, fetchPublicArticles } = await useArticle();
await fetchPublicArticles();
</script>

<template>
  <div class="w-full">
    <div class="flex flex-col gap-3" v-if="!loading">
      <NewsMainActu style="--stagger: 1" data-animate :articles="articles" />
      <NewsListActu style="--stagger: 2" data-animate :articles="articles" class="mt-8" />
    </div>
    <div v-else>prout</div>
  </div>
</template>

<style scoped lang="scss"></style>
