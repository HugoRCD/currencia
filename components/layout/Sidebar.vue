<script lang="ts" setup>
import { ViewColumnsIcon, ChartBarIcon } from "@heroicons/vue/24/outline";

const navigations = getNavigation("app");
const admin_navigations = getNavigation("admin");

const userStore = useUserStore();

const open = ref(true);

// wtcher route change
const route = useRoute();
const newItems = ref([]);
watch(
  () => route.path,
  () => {
    if (route.path.includes("/app/crypto")) {
      newItems.value = [
        {
          title: "Crypto details",
          description: "Crypto",
          icon: ChartBarIcon,
          to: route.path,
          name: "Crypto details",
        },
      ];
      navigations.unshift(...newItems.value);
    } else {
      const indexToRemove = navigations.findIndex((item) => item.name === "Crypto details");

      // Vérifier si l'index a été trouvé
      if (indexToRemove !== -1) {
        // Utiliser splice pour supprimer l'élément à l'index trouvé
        navigations.splice(indexToRemove, 1);
      }
    }
  },
);
</script>

<template>
  <div class="m-2 flex flex-col transition-all duration-300 ease-in-out" :class="open ? 'sm:w-[250px] pr-0 sm:pr-2' : 'sm:w-[45px]'">
    <!-- Top part -->
    <div class="hidden sm:flex justify-center items-center gap-2 my-2">
      <User :class="!open ? 'hidden' : 'flex'" />
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
        <TransitionGroup name="fade" tag="ul" class="flex flex-col gap-2" @enter="enter" @leave="leave">
          <LayoutNavItem v-for="nav in navigations" :key="nav.name" :active="nav.to === $route.path" :nav_item="nav" :open="open" />
        </TransitionGroup>
      </div>

      <hr v-if="userStore.isAdmin" class="border-gray-300 dark:border-gray-700 border-1 rounded-lg w-2/3 mx-auto my-3" />

      <!-- Admin -->
      <div v-if="userStore.isAdmin" class="flex flex-col gap-2">
        <div class="text-xs text-center sm:text-left sm:text-sm font-semibold text-gray-500 dark:text-gray-400" :class="!open ? 'text-center' : 'text-left'">
          Admin
        </div>
        <LayoutNavItem v-for="nav in admin_navigations" :key="nav.name" :active="nav.to === $route.path" :nav_item="nav" :open="open" />
      </div>
    </div>
    <div class="flex-1" />
    <!-- Bottom part -->
    <div class="flex flex-col sm:flex-row gap-4 justify-between items-center mb-4 sm:mb-0" :class="!open ? 'sm:flex-col' : ''">
      <UTooltip text="Change theme">
        <ThemeToggle />
      </UTooltip>
      <UTooltip text="Back to home">
        <UButton icon="i-heroicons-arrow-left-on-rectangle-20-solid" color="gray" variant="ghost" @click="$router.push('/')" />
      </UTooltip>
    </div>
  </div>
</template>
