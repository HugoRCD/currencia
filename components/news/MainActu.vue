<script setup lang="ts">
import type { Article } from "~/types/Article";
import type { PropType } from "vue";

const props = defineProps({
  articles: {
    type: Array as PropType<Article[]>,
    required: true,
  },
});

const activeArticle = ref(props.articles[0]);
const interval = ref();
onMounted(() => {
  interval.value = setInterval(() => {
    const index = props.articles.findIndex((article) => article.id === activeArticle.value.id);
    if (index === props.articles.length - 1) {
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
    <div class="flex">
      <div class="w-2/3 h-full relative">
        <img :src="activeArticle.image" class="rounded-bl-xl rounded-tl-xl h-full" alt="Bitcoin" />
        <div class="absolute w-full bottom-10 flex items-center justify-center">
          <div class="flex justify-between w-35 absolute">
            <div
              class="h-2 bg-white rounded-full cursor-pointer transition duration-300 m-2"
              :class="activeArticle.id === 1 ? 'w-4' : 'w-2'"
              @click="activeArticle = articles[0]"
            ></div>
            <div
              class="h-2 bg-white rounded-full cursor-pointer transition duration-300 m-2"
              :class="activeArticle.id === 2 ? 'w-4' : 'w-2'"
              @click="activeArticle = articles[1]"
            ></div>
            <div
              class="h-2 bg-white rounded-full cursor-pointer transition duration-300 m-2"
              :class="activeArticle.id === 3 ? 'w-4' : 'w-2'"
              @click="activeArticle = articles[2]"
            ></div>
          </div>
        </div>
      </div>
      <div class="w-1/3 h-full flex flex-col">
        <NewsPrincipalActuCard
          v-for="(article, index) in articles"
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
