<script setup lang="ts">
import type { Navigation } from "~/composables/useNavigation";
import type { PropType } from "vue";
import { useLogout } from "~/composables/useUser";

defineProps({
  nav_item: {
    type: Object as PropType<Navigation>,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="flex items-center" @click="nav_item.name === 'Logout' ? useLogout() : $router.push(nav_item.to)">
    <UIcon :name="nav_item.iconString" class="h-8 w-8 text-neutral-400" :class="{ 'text-primary-500': active }" />
  </div>
</template>

<style scoped lang="scss"></style>
