<script setup lang="ts">
import { ExclamationTriangleIcon, ChartBarIcon } from '@heroicons/vue/24/outline'

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)

const smAndLarger = breakpoints.greaterOrEqual('sm')

const pages = [...getNavigation('app'), ...getNavigation('admin'), ...getNavigation('user')]
const route = useRoute()
const currentPage = computed(() => {
  const page = pages.find((page) => page.to === route.path)
  const fallback = route.path.includes('/app/crypto')
    ? { title: 'Crypto details', description: 'Crypto', icon: ChartBarIcon, to: '/app/crypto', name: 'crypto', iconString: 'i-heroicons-chart-bar' }
    : { title: '404', description: 'Page not found', icon: ExclamationTriangleIcon, to: '/404', name: '404', iconString: 'i-heroicons-exclamation-triangle' }
  return page ?? fallback
})
</script>

<template>
  <div class="max-layout-width relative flex h-screen pt-4">
    <LayoutSidebar class="hidden sm:flex" />
    <LayoutMobileNavbar v-if="!smAndLarger" class="absolute inset-x-0 bottom-0 z-20 sm:hidden" />
    <LayoutSectionWrapper :navigation="currentPage">
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

<style scoped lang="scss"></style>
