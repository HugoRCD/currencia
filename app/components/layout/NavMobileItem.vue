<script setup lang="ts">
const { clear } = useUserSession()

type NavMobileItem = {
  navItem: Navigation
  active: boolean
}

const { active = false } = defineProps<NavMobileItem>()
</script>

<template>
  <div class="flex items-center" @click="navItem.name === 'Logout' ? clear() : $router.push(navItem.to)">
    <UIcon :name="navItem.icon" class="size-7 text-neutral-400" :class="{ 'text-primary-500': active }" />
  </div>
</template>

