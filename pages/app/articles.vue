<script setup lang="ts">
import ListActu from "~/components/news/ListActu.vue";
</script>

<template>
  <LayoutSectionWrapper
    title="Latest Crypto News"
    description="The Community displays the latest crypto news published by projects from all corners of the crypto world."
  >
    <div class="flex flex-col gap-3">
      <ListActu></ListActu>
    </div>
  </LayoutSectionWrapper>
</template>

<style scoped lang="scss"></style>
