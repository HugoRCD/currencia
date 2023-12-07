<script setup lang="ts">
const navigations = getNavigation("app");
const user_navigations = getNavigation("user");
</script>

<template>
  <div class="flex justify-center">
    <div class="flex backdrop-blur-sm bg-neutral-100/90 dark:bg-neutral-800/90 px-6 py-2 rounded-lg m-2 shadow-lg">
      <div class="flex gap-3">
        <LayoutNavItem v-for="nav in navigations" :key="nav.name" :active="nav.to === $route.path" :nav_item="nav" :open="false" class="scale-110" />
      </div>
      <div v-if="isLoggedIn" class="flex gap-3">
        <LayoutNavItem v-for="nav in user_navigations" :key="nav.name" :active="nav.to === $route.path" :nav_item="nav" :open="false" class="scale-110" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
