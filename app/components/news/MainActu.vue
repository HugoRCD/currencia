<script setup lang="ts">
import type { PropType } from 'vue'
import type { Article } from '~/types/Article'

const props = defineProps({
  articles: {
    type: Array as PropType<Article[]>,
    required: true,
  },
})

const activeArticle = ref<Article>(props.articles[0])
const interval = ref()
const isHovered = ref(false)

const startInterval = (article?: Article) => {
  interval.value = setInterval(() => {
    if (article) {
      activeArticle.value = article
    } else {
      const index = props.articles.findIndex((article) => article.id === activeArticle.value.id)
      if (index >= 2) {
        activeArticle.value = props.articles[0]
      } else {
        activeArticle.value = props.articles[index + 1]
      }
    }
    article = undefined
  }, 3000)
}

onMounted(() => {
  startInterval()
})

onUnmounted(() => {
  clearInterval(interval.value)
})

const resetTransition = () => {
  clearInterval(interval.value)
}

const handleMouseEnter = (article: Article) => {
  activeArticle.value = article
  resetTransition()
  isHovered.value = true
}

const handleMouseLeave = (article: Article) => {
  isHovered.value = false
  startInterval(article)
}

const changeArticle = (article: Article) => {
  activeArticle.value = article
  resetTransition()
  startInterval(article)
}
</script>

<template>
  <div class="flex flex-col lg:flex-row">
    <div class="row relative flex h-[30rem] w-full lg:w-2/3">
      <div class="row absolute flex size-full overflow-hidden">
        <img
          v-for="article in articles.slice(0, 3)"
          :key="article.id"
          :src="article.preview"
          :class="{
            'w-full': article.id === activeArticle.id,
            'w-0': article.id !== activeArticle.id,
          }"
          class="rounded-xl object-cover transition-all duration-1000 ease-in-out md:rounded-tr-xl lg:rounded-l-xl"
          alt="Article preview"
        >
      </div>
      <div class="absolute bottom-5 flex w-full items-center justify-center">
        <div class="w-35 absolute flex justify-between">
          <div
            v-for="(article, index) in articles.slice(0, 3)"
            :key="index"
            class="m-2 h-2 cursor-pointer rounded-full bg-white transition duration-300"
            :class="activeArticle.id === article.id ? 'w-4' : 'w-2'"
            @click="changeArticle(article)"
          />
        </div>
      </div>
    </div>

    <div class="flex h-[30rem] w-full flex-col justify-between p-1 lg:w-1/3">
      <NewsPrincipalActuCard
        v-for="(article, index) in articles.slice(0, 3)"
        :key="index"
        :article
        :index
        :active="article.id === activeArticle.id"
        @mouseover="handleMouseEnter(article)"
        @mouseleave="handleMouseLeave(article)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
