<script setup lang="ts">
import type { PropType } from 'vue'

const { clear } = useUserSession()

defineProps({
  navItem: {
    type: Object as PropType<Navigation>,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="flex items-center" @click="navItem.name === 'Logout' ? clear() : $router.push(navItem.to)">
    <UIcon :name="navItem.icon" class="size-7 text-neutral-400" :class="{ 'text-primary-500': active }" />
  </div>
</template>

