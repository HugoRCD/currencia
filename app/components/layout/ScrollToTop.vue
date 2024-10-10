<script setup lang="ts">
import { ArrowUpIcon } from '@heroicons/vue/24/outline'

const isScrolling = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolling.value = window.scrollY > 0
  })
})

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
  <div class="fixed bottom-36 right-3 z-50 sm:bottom-20">
    <div
      aria-label="scroll to top button"
      class="text-muted flex size-10 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white p-1 shadow-md transition-all duration-200 hover:border-gray-300 hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
      rounded
      :class="{ 'opacity-100': isScrolling, 'opacity-0': !isScrolling }"
      @click="scrollToTop"
    >
      <ArrowUpIcon class="z-20 size-6" />
    </div>
  </div>
</template>

<style scoped></style>
