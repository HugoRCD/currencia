<script setup lang="ts">
await useArticle().fetchPublicArticles();
</script>

<template>
  <div>
    <!-- Featured -->
    <div style="--stagger: 1" data-animate class="flex flex-col gap-3">
      <NewsMainActu style="--stagger: 1" data-animate :articles="usePublicArticle().value" />
    </div>

    <!-- Latest News -->
    <div style="--stagger: 2" data-animate class="flex flex-col gap-3 mt-8">
      <h2 class="text-xl font-bold">Recently in the crypto world</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NewsCardActu v-for="(article, index) in usePublicArticle().value" :key="index" :article="article" :index="index" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
