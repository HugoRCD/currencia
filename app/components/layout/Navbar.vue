<script lang="ts" setup>
const navigation = getNavigation('home')
</script>

<template>
  <div class="mx-auto my-2 flex w-full items-center justify-center">
    <header class="rounded-full">
      <div class="rounded-full border border-white/10 bg-zinc-900/10 backdrop-blur-3xl dark:border-zinc-900/20 dark:bg-zinc-700/20">
        <nav class="z-10 flex h-[50px] justify-around gap-2 p-1 transition-all duration-300 ease-in-out sm:h-[45px] sm:hover:gap-4">
          <NuxtLink
            v-for="item in navigation"
            :id="item.name.toLowerCase()"
            :key="item.name"
            :aria-label="item.name + ' navigation link'"
            :class="[
              item.name === $route.name
                ? 'border border-white/5 bg-zinc-900/10 text-black/80 shadow-2xl shadow-black/50 backdrop-blur-3xl dark:text-white/75 dark:shadow-white/50'
                : 'dark:text-muted text-black/60',
            ]"
            :to="item.to"
            class="hover:bg-white-900/50 flex items-center rounded-full border border-transparent px-4 py-1 transition-all duration-300 ease-in-out hover:border-white/5 hover:text-black sm:px-6 dark:hover:text-white/70"
          >
            <component :is="item.icon" class="size-7 font-medium sm:size-6" />
            <span class="ml-2 hidden font-medium sm:inline-block">{{ item.name }}</span>
          </NuxtLink>
        </nav>
      </div>
    </header>
  </div>
</template>
