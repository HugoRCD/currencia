<script lang="ts" setup>
const navigations = getNavigation('app')
const userNavigations = getNavigation('user')
const adminNavigations = getNavigation('admin')

const { user, loggedIn } = useUserSession()

const open = ref(true)

const route = useRoute()
const handleCryptoNavigation = () => {
  const isCryptoRoute = route.path.includes('/app/crypto')
  const cryptoNavigation = {
    title: 'Crypto details',
    description: 'Crypto',
    icon: 'lucide:chart-line',
    to: route.path,
    name: 'Crypto details',
  }
  if (isCryptoRoute) {
    const indexToReplace = navigations.findIndex((item) => item.to.includes('/app/crypto'))
    if (indexToReplace !== -1) {
      navigations.splice(indexToReplace, 1, cryptoNavigation)
    } else {
      navigations.unshift(cryptoNavigation)
    }
  } else {
    const indexToRemove = navigations.findIndex((item) => item.to.includes('/app/crypto'))
    if (indexToRemove !== -1) {
      navigations.splice(indexToRemove, 1)
    }
  }
}

watch(() => route.path, handleCryptoNavigation, { immediate: true })
</script>

<template>
  <div class="m-2 flex flex-col transition-all duration-300 ease-in-out" :class="open ? 'sm:w-[250px] pr-0 sm:pr-2' : 'sm:w-[45px]'">
    <!-- Top part -->
    <div class="my-1 flex items-center justify-center gap-2 sm:my-2" :class="!open ? 'sm:flex-col-reverse' : ''">
      <User :side-bar-open="open" />
      <UTooltip text="Toggle sidebar" class="hidden select-none sm:block">
        <UButton
          size="sm"
          color="white"
          icon="lucide:panel-right"
          variant="soft"
          class="hidden select-none sm:block"
          @click="open = !open"
        />
      </UTooltip>
    </div>
    <div class="mt-3 flex flex-col gap-3">
      <LayoutCommandConsole :sidebar-open="open" />

      <UDivider class="my-3" />

      <div class="flex flex-col gap-2">
        <TransitionGroup name="fade" tag="ul" class="flex flex-col gap-2" mode="out-in">
          <LayoutNavItem v-for="nav in navigations" :key="nav.name" :active="nav.to === $route.path" :nav-item="nav" :open />
        </TransitionGroup>
      </div>

      <Transition name="slide" mode="out-in">
        <div v-if="loggedIn" class="flex flex-col gap-2">
          <!-- User -->
          <div class="flex flex-col gap-2">
            <UDivider class="my-3" />
            <LayoutNavItem v-for="nav in userNavigations" :key="nav.name" :active="nav.to === $route.path" :nav-item="nav" :open />
          </div>

          <!-- Admin -->
          <div v-if="user.role === 'admin'" class="flex flex-col gap-2">
            <UDivider class="my-3" />
            <LayoutNavItem v-for="nav in adminNavigations" :key="nav.name" :active="nav.to === $route.path" :nav-item="nav" :open />
          </div>
        </div>
      </Transition>
    </div>
    <div class="flex-1" />
    <!-- Bottom part -->
    <div class="mb-4 flex flex-col items-center justify-between gap-4 sm:mb-0 sm:flex-row" :class="!open ? 'sm:flex-col' : ''">
      <UTooltip text="Change theme">
        <ThemeToggle />
      </UTooltip>
      <UTooltip text="Back to home">
        <UButton icon="heroicons:arrow-left-on-rectangle-20-solid" color="gray" variant="ghost" @click="$router.push('/')" />
      </UTooltip>
    </div>
  </div>
</template>

<style scoped>
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
