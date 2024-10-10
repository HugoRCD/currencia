<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)

const smAndLarger = breakpoints.greaterOrEqual('sm')

const route = useRoute()

const pages = [
  ...getNavigation('app'),
  ...getNavigation('admin'),
  ...getNavigation('user')
]

const navigation = computed(() => {
  if (route.path.includes('/app/crypto')) {
    return {
      title: 'Crypto details',
      description: 'Crypto',
      icon: 'lucide:chart-line',
      to: '/app/crypto',
      name: 'crypto'
    }
  }
  return pages.find((page) => page.to === route.path)
})
</script>

<template>
  <div class="max-layout-width relative flex h-screen pt-4">
    <LayoutSidebar class="hidden sm:flex" />
    <LayoutMobileNavbar v-if="!smAndLarger" class="absolute inset-x-0 bottom-0 z-20 sm:hidden" />
    <LayoutSectionWrapper :navigation>
      <Suspense>
        <slot />
        <template #fallback>
          <div class="flex h-64 items-center justify-center">
            <div class="size-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-gray-100" />
          </div>
        </template>
      </Suspense>
    </LayoutSectionWrapper>
  </div>
</template>
