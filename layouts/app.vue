<script setup lang="ts">
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
const pages = [...getNavigation("app"), ...getNavigation("admin")];
const currentPage = computed(() => {
  const page = pages.find((page) => page.to === useRoute().path);
  return page || { title: "404", description: "Page not found", icon: ExclamationTriangleIcon, to: "/404", name: "404" };
});
</script>

<template>
  <div class="flex app-background pt-2 h-screen">
    <LayoutSidebar />
    <LayoutSectionWrapper :navigation="currentPage">
      <slot />
    </LayoutSectionWrapper>
  </div>
</template>

<style scoped lang="scss"></style>
