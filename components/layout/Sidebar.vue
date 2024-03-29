<script lang="ts" setup>
import { ViewColumnsIcon, ChartBarIcon } from "@heroicons/vue/24/outline";
import type { Navigation } from "~/composables/useNavigation";

const navigations = getNavigation("app");
const user_navigations = getNavigation("user");
const admin_navigations = getNavigation("admin");

const open = ref(true);

const route = useRoute();
const handleCryptoNavigation = () => {
  const isCryptoRoute = route.path.includes("/app/crypto");
  const cryptoNavigation = <Navigation>{
    title: "Crypto details",
    description: "Crypto",
    icon: ChartBarIcon,
    to: route.path,
    name: "Crypto details",
  };
  if (isCryptoRoute) {
    const indexToReplace = navigations.findIndex((item) => item.to.includes("/app/crypto"));
    if (indexToReplace !== -1) {
      navigations.splice(indexToReplace, 1, cryptoNavigation);
    } else {
      navigations.unshift(cryptoNavigation);
    }
  } else {
    const indexToRemove = navigations.findIndex((item) => item.to.includes("/app/crypto"));
    if (indexToRemove !== -1) {
      navigations.splice(indexToRemove, 1);
    }
  }
};

watch(() => route.path, handleCryptoNavigation, { immediate: true });
</script>

<template>
  <div class="m-2 flex flex-col transition-all duration-300 ease-in-out" :class="open ? 'sm:w-[250px] pr-0 sm:pr-2' : 'sm:w-[45px]'">
    <!-- Top part -->
    <div class="flex justify-center items-center gap-2 my-1 sm:my-2" :class="!open ? 'sm:flex-col-reverse' : ''">
      <User :side-bar-open="open" />
      <UTooltip text="Toggle sidebar" class="select-none hidden sm:block">
        <UButton size="sm" color="white" variant="soft" class="select-none hidden sm:block" @click="open = !open">
          <ViewColumnsIcon class="w-5 h-5" />
        </UButton>
      </UTooltip>
    </div>
    <div class="flex flex-col gap-3 mt-3">
      <LayoutCommandConsole :sidebarOpen="open" />

      <UDivider class="my-3" />

      <div class="flex flex-col gap-2">
        <TransitionGroup name="fade" tag="ul" class="flex flex-col gap-2" mode="out-in">
          <LayoutNavItem v-for="nav in navigations" :key="nav.name" :active="nav.to === $route.path" :nav_item="nav" :open="open" />
        </TransitionGroup>
      </div>

      <Transition name="slide" mode="out-in">
        <div class="flex flex-col gap-2" v-if="isLoggedIn">
          <!-- User -->
          <div class="flex flex-col gap-2">
            <UDivider class="my-3" />
            <LayoutNavItem v-for="nav in user_navigations" :key="nav.name" :active="nav.to === $route.path" :nav_item="nav" :open="open" />
          </div>

          <!-- Admin -->
          <div class="flex flex-col gap-2" v-if="isAdmin">
            <UDivider class="my-3" />
            <LayoutNavItem v-for="nav in admin_navigations" :key="nav.name" :active="nav.to === $route.path" :nav_item="nav" :open="open" />
          </div>
        </div>
      </Transition>
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

<style scoped lang="scss">
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

.fade-leave-active {
  position: absolute;
}
</style>
