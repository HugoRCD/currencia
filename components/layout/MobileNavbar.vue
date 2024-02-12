<script setup lang="ts">
const navigations = getNavigation("app");
const user_navigations = getNavigation("user");
</script>

<template>
  <div class="flex justify-center">
    <div class="flex w-full backdrop-blur-sm bg-white/90 dark:bg-neutral-800/90 px-6 py-3 justify-center items-center gap-6">
      <LayoutNavMobileItem v-for="nav in navigations" :key="nav.name" :nav_item="nav" :active="nav.to === $route.path" />
      <LayoutCommandConsole mobile-mode class="scale-105" />
      <template v-if="isLoggedIn">
        <LayoutNavMobileItem
          v-for="nav in user_navigations.filter((nav) => nav.name !== 'Logout')"
          :key="nav.name"
          :nav_item="nav"
          :active="nav.to === $route.path"
        />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
