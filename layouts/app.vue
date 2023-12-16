<script setup lang="ts">
import { ExclamationTriangleIcon, ChartBarIcon } from "@heroicons/vue/24/outline";
const pages = [...getNavigation("app"), ...getNavigation("admin"), ...getNavigation("user")];
const route = useRoute();
const currentPage = computed(() => {
  const page = pages.find((page) => page.to === route.path);
  const fallback = route.path.includes("/app/crypto")
    ? { title: "Crypto details", description: "Crypto", icon: ChartBarIcon, to: "/app/crypto", name: "crypto" }
    : { title: "404", description: "Page not found", icon: ExclamationTriangleIcon, to: "/404", name: "404" };
  return page ?? fallback;
});
</script>

<template>
  <div class="flex h-screen pt-4 max-layout-width relative">
    <LayoutSidebar class="hidden sm:flex" />
    <LayoutMobileNavbar class="sm:hidden absolute bottom-0 left-0 right-0 z-20" />
    <LayoutSectionWrapper :navigation="currentPage">
      <slot />
    </LayoutSectionWrapper>
  </div>
</template>

<style scoped lang="scss"></style>
