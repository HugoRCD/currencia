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
const isHovered = ref(false);

const startInterval = (article?: Article) => {
  interval.value = setInterval(() => {
    if (article) {
      activeArticle.value = article;
    } else {
      const index = props.articles.findIndex((article) => article.id === activeArticle.value.id);
      if (index >= 2) {
        activeArticle.value = props.articles[0];
      } else {
        activeArticle.value = props.articles[index + 1];
      }
    }
    article = undefined;
  }, 3000);
};

onMounted(() => {
  startInterval();
});

onUnmounted(() => {
  clearInterval(interval.value);
});

const resetTransition = () => {
  clearInterval(interval.value);
};

const handleMouseEnter = (article: Article) => {
  activeArticle.value = article;
  resetTransition();
  isHovered.value = true;
};

const handleMouseLeave = (article: Article) => {
  isHovered.value = false;
  startInterval(article);
};

const changeArticle = (article: Article) => {
  activeArticle.value = article;
  resetTransition();
  startInterval(article);
};
</script>

<template>
  <div class="flex lg:flex-row flex-col">
    <div class="lg:w-2/3 w-full h-[30rem] relative flex row">
      <div class="absolute flex row w-full h-full overflow-hidden">
        <img
          v-for="(article, index) in articles.slice(0, 3)"
          :key="article.id"
          :src="article.preview"
          :class="{
            'w-full': index === activeArticle.id - 1,
            'w-0': index !== activeArticle.id - 1,
          }"
          class="lg:rounded-bl-xl lg:rounded-tl-xl rounded-xl md:rounded-tr-xl object-cover transition-all duration-1000 ease-in-out"
          alt="Article preview"
        />
      </div>
      <div class="absolute w-full bottom-5 flex items-center justify-center">
        <div class="flex justify-between w-35 absolute">
          <div
            v-for="(article, index) in articles.slice(0, 3)"
            :key="index"
            class="h-2 bg-white rounded-full cursor-pointer transition duration-300 m-2"
            :class="activeArticle.id === article.id ? 'w-4' : 'w-2'"
            @click="changeArticle(article)"
          ></div>
        </div>
      </div>
    </div>

    <div class="lg:w-1/3 w-full h-[30rem] flex flex-col justify-between p-1">
      <NewsPrincipalActuCard
        v-for="(article, index) in articles.slice(0, 3)"
        :key="index"
        :article="article"
        :index="index"
        :active="article.id === activeArticle.id"
        @mouseover="handleMouseEnter(article)"
        @mouseleave="handleMouseLeave(article)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
