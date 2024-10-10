<script setup lang="ts">
const { articles } = useArticle()

await useArticle().fetchPublicArticles()

const articlesVisible = usePublicArticle()

const search = ref('')

const filteredArticles = computed(() =>
  articlesVisible.value.filter((article) => {
    const name = article.title.toLowerCase()
    const description = article.description.toLowerCase()
    const searchValue = search.value.toLowerCase()
    return name.includes(searchValue) || description.includes(searchValue)
  }),
)
</script>

<template>
  <div>
    <!-- Featured -->
    <div style="--stagger: 1" data-animate class="flex flex-col gap-3">
      <NewsMainActu style="--stagger: 1" data-animate :articles="usePublicArticle().value" />
    </div>

    <!-- Latest News -->
    <div style="--stagger: 2" data-animate class="mt-8 flex flex-col gap-3">
      <div class="flex w-full flex-row gap-3">
        <h2 class="w-1/3 text-xl font-bold">
          Recently in the crypto world
        </h2>
        <div class="flex w-2/3 flex-col justify-end gap-4 sm:flex-row sm:items-center">
          <UInput v-model="search" label="Search" placeholder="Search a article" icon="i-heroicons-magnifying-glass-20-solid" />
        </div>
      </div>
      <div v-if="filteredArticles.length !== 0" class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <NewsCardActu v-for="(article, index) in filteredArticles" :key="index" :article :index />
      </div>
      <div v-if="filteredArticles.length === 0" class="flex w-full justify-center">
        <p class="mt-10 text-xl font-bold">
          No articles found
        </p>
      </div>
    </div>
  </div>
</template>

