<script setup lang="ts">
const { articles } = useArticle();

await useArticle().fetchPublicArticles();

const articlesVisible = usePublicArticle();

const search = ref("");

const filteredArticles = computed(() =>
  articlesVisible.value.filter((article) => {
    const name = article.title.toLowerCase();
    const description = article.description.toLowerCase();
    const searchValue = search.value.toLowerCase();
    return name.includes(searchValue) || description.includes(searchValue);
  }),
);
</script>

<template>
  <div>
    <!-- Featured -->
    <div style="--stagger: 1" data-animate class="flex flex-col gap-3">
      <NewsMainActu style="--stagger: 1" data-animate :articles="usePublicArticle().value" />
    </div>

    <!-- Latest News -->
    <div style="--stagger: 2" data-animate class="flex flex-col gap-3 mt-8">
      <div class="flex flex-row gap-3 w-full">
        <h2 class="text-xl font-bold w-1/3">Recently in the crypto world</h2>
        <div class="flex justify-end sm:items-center gap-4 flex-col sm:flex-row w-2/3">
          <UInput v-model="search" label="Search" placeholder="Search a article" icon="i-heroicons-magnifying-glass-20-solid" />
        </div>
      </div>
      <div v-if="filteredArticles.length !== 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NewsCardActu v-for="(article, index) in filteredArticles" :key="index" :article="article" :index="index" />
      </div>
      <div class="w-full flex justify-center" v-if="filteredArticles.length === 0">
        <p class="text-xl font-bold mt-10">No articles found</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
