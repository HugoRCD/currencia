<script lang="ts" setup>
import { ArrowLeftOnRectangleIcon, ViewColumnsIcon } from "@heroicons/vue/24/outline";

const navigations = getNavigation("app");
const admin_navigations = getNavigation("admin");

const open = ref(true);
</script>

<template>
  <div class="m-2 flex flex-col transition-all duration-300 ease-in-out" :class="open ? 'sm:w-[250px] pr-0 sm:pr-2' : 'sm:w-[45px]'">
    <!-- Top part -->
    <div class="hidden sm:flex justify-center items-center gap-2 my-2">
      <UButton color="white" variant="soft" size="sm" class="flex-1 text-left font-semibold" :class="!open ? 'hidden' : 'block'">
        <div class="whitespace-nowrap">Hi, Hugo</div>
      </UButton>
      <UTooltip text="Toggle sidebar">
        <UButton size="sm" color="white" variant="soft" class="select-none hidden sm:block" @click="open = !open">
          <ViewColumnsIcon class="w-5 h-5" />
        </UButton>
      </UTooltip>
    </div>
    <div class="flex flex-col gap-3 mt-3">
      <LayoutCommandConsole :sidebarOpen="open" />

      <hr class="border-gray-300 dark:border-gray-700 border-1 rounded-lg w-2/3 mx-auto my-3" />

      <div class="flex flex-col gap-2">
        <LayoutNavItem v-for="nav in navigations" :key="nav.name" :active="nav.to === $route.path" :nav_item="nav" :open="open" />
      </div>

      <hr class="border-gray-300 dark:border-gray-700 border-1 rounded-lg w-2/3 mx-auto my-3" />

      <!-- Admin -->
      <div v-if="true" class="flex flex-col gap-2">
        <div class="text-xs text-center sm:text-left sm:text-sm font-semibold text-gray-500 dark:text-gray-400" :class="!open ? 'text-center' : 'text-left'">
          Admin
        </div>
        <LayoutNavItem v-for="nav in admin_navigations" :key="nav.name" :active="nav.to === $route.path" :nav_item="nav" :open="open" />
      </div>
    </div>
    <div class="flex-1" />
    <!-- Bottom part -->
    <div class="flex flex-col gap-2 justify-center items-center sm:items-start mb-4 sm:mb-0">
      <div class="flex w-full" :class="!open ? 'justify-center' : 'justify-start'">
        <UTooltip text="Change theme">
          <ThemeToggle />
        </UTooltip>
      </div>
      <UTooltip class="w-full" text="Back to home">
        <div
          class="hidden w-full cursor-pointer main-container sm:flex items-center justify-between px-3 py-2 rounded-xl shadow-sm border"
          @click="$router.push('/')"
        >
          <div class="flex flex-row items-center" :class="!open ? 'hidden' : 'block'">
            <SvgoNuxt :fontControlled="false" class="w-8 h-8 text-gray-500 dark:text-gray-400" />
            <span class="ml-2 text-lg font-semibold text-gray-700 dark:text-gray-200"> Currencia<span class="text-primary">.</span> </span>
          </div>
          <ArrowLeftOnRectangleIcon class="w-6 h-6 cursor-pointer text-neutral-700 dark:text-white" />
        </div>
      </UTooltip>
      <ArrowLeftOnRectangleIcon
        class="w-6 h-6 cursor-pointer text-neutral-700 dark:text-white"
        @click="$router.push('/')"
        :class="[
          // hidden if on mobile or if the sidebar is open
          'sm:hidden',
          open ? 'hidden' : 'block',
        ]"
      />
    </div>
  </div>
</template>
