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
    <div v-else>
      <div class="loader-container">
        <div class="loader"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loader-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.loader {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
