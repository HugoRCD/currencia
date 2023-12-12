<script setup lang="ts">
import type { Article } from "~/types/Article";
import type { PropType } from "vue";

const props = defineProps({
  articles: {
    type: Array as PropType<Article[]>,
    required: true,
  },
});

const activeArticle = ref<Article>(props.articles[0]);
const interval = ref();
onMounted(() => {
  interval.value = setInterval(() => {
    const index = props.articles.findIndex((article) => article.id === activeArticle.value.id);
    if (index >= 2) {
      activeArticle.value = props.articles[0];
    } else {
      activeArticle.value = props.articles[index + 1];
    }
  }, 3000);
});

onUnmounted(() => {
  clearInterval(interval.value);
});
</script>

<template>
  <div class="flex flex-col gap-3">
    <h2 class="text-xl font-bold">Principally</h2>
    <div class="flex lg:flex-row flex-col">
      <div class="lg:w-2/3 w-full h-[30rem] relative">
        <img
          v-if="activeArticle && activeArticle.preview"
          :src="activeArticle.preview"
          class="lg:rounded-bl-xl lg:rounded-tl-xl rounded-xl md:rounded-tr-xl w-full h-full object-cover"
          alt="Bitcoin"
        />
        <div class="absolute w-full bottom-5 flex items-center justify-center">
          <div class="flex justify-between w-35 absolute">
            <div
              v-for="(article, index) in articles.slice(0, 3)"
              :key="index"
              class="h-2 bg-white rounded-full cursor-pointer transition duration-300 m-2"
              :class="activeArticle.id === article.id ? 'w-4' : 'w-2'"
              @click="activeArticle = article"
            ></div>
          </div>
        </div>
      </div>
      <div class="lg:w-1/3 w-full h-full flex flex-col">
        <NewsPrincipalActuCard
          v-for="(article, index) in articles.slice(0, 3)"
          :key="index"
          :article="article"
          :index="index"
          :active="article.id === activeArticle.id"
          @mouseover="activeArticle = article"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
