<script lang="ts" setup>
import {
  ArrowLeftOnRectangleIcon,
} from "@heroicons/vue/24/outline";

const navigations = getNavigation("app");
const admin_navigations = getNavigation("admin");
</script>

<template>
  <div class="mr-2 flex flex-col w-64">
    <!-- Top part -->
    <div class="flex flex-col gap-3">
      <div class="main-container flex flex-row items-center px-3 py-2 rounded-xl shadow-sm border">
        <SvgoNuxt :fontControlled="false" class="w-8 h-8 text-gray-500 dark:text-gray-400"/>
        <span class="ml-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
        Currencia<span class="text-primary">.</span>
      </span>
      </div>
      <div>
        <CryptoSelector/>
      </div>
      <div class="flex flex-col gap-2">
        <div v-for="nav in navigations" :key="nav.name" :class="{ 'active': nav.to === $route.path }"
             class="nav-item"
             @click="$router.push(nav.to)"
        >
          <component :is="nav.icon" class="w-5 h-5 text-gray-500 dark:text-gray-400"/>
          <span class="text-sm font-medium">
              {{ nav.name }}
          </span>
        </div>
      </div>

      <hr class="border-gray-300 dark:border-gray-700 border-1 rounded-lg w-2/3 mx-auto my-4" />

      <!-- Admin -->
      <div v-if="true" class="flex flex-col gap-2">
        <div class="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Admin
        </div>
        <div v-for="nav in admin_navigations" :key="nav.name" :class="{ 'active': nav.to === $route.path }"
             class="nav-item"
             @click="$router.push(nav.to)"
        >
          <component :is="nav.icon" class="w-5 h-5 text-gray-500 dark:text-gray-400"/>
          <span class="text-sm font-medium">
              {{ nav.name }}
          </span>
        </div>
      </div>
    </div>
    <div class="flex-1"/>
    <!-- Bottom part -->
    <div class="flex justify-between">
      <ThemeToggle/>
      <UTooltip text="Back to home" @click="$router.push('/')">
        <UButton class="flex items-center justify-center" color="gray">
          <ArrowLeftOnRectangleIcon class="w-5 h-5 text-gray-500 dark:text-gray-400"/>
        </UButton>
      </UTooltip>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-item {
  @apply cursor-pointer rounded-lg px-3 py-2 flex flex-row items-center gap-2;
  @apply hover:bg-gray-100 dark:hover:bg-gray-800;
  @apply text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200;

  &.active {
    @apply main-container border-l-4 border-primary;
  }
}
</style>