<script setup lang="ts">
const pages = [...getNavigation("app"), ...getNavigation("admin")];
const currentPage = computed(() => {
  const page = pages.find((page) => page.to === useRoute().path);
  return page || { title: "404", description: "Page not found" };
});
</script>

<template>
  <div class="flex app-background pt-2 h-screen relative">
    <LayoutSidebar />
    <div class="main-container flex flex-1 overflow-y-auto p-5 rounded-tl-2xl shadow-md border border-gray-200 dark:border-gray-700">
      <LayoutSectionWrapper :title="currentPage.title" :description="currentPage.description" class="flex-1">
        <slot />
      </LayoutSectionWrapper>
    </div>
    <LayoutHelpCenter class="absolute bottom-3 right-2 sm:right-6" />
  </div>
</template>

<style scoped lang="scss"></style>
