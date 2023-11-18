<script setup lang="ts">
import type { FunctionalComponent, PropType } from "vue";

type NavItem = {
  name: string;
  to: string;
  icon: FunctionalComponent;
};

defineProps({
  nav_item: {
    type: Object as PropType<NavItem>,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  open: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="nav-item" @click="$router.push(nav_item.to)" :class="{ active: active }">
    <component :is="nav_item.icon" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
    <span class="text-sm font-medium hidden sm:block" v-if="open">
      {{ nav_item.name }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.nav-item {
  @apply cursor-pointer rounded-lg px-3 py-2 flex flex-row items-center gap-2;
  border: 1px solid transparent;
  transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
}

.light {
  .nav-item:hover {
    color: #575757;
    border: 1px solid #ececec;
    box-shadow: 0 1px 0 #cccccc, 0 -3px 0 #ececec inset;
  }

  .nav-item:active {
    box-shadow: 0 1px 0 #cccccc, 0 -0.5px 0 #ececec inset;
  }

  .nav-item.active {
    color: #575757;
    border: 1px solid #ececec;
    background-color: #ffffff;
    box-shadow: 0 1px 0 #cccccc, 0 -3px 0 #ececec inset;
  }
}

.dark {
  .nav-item:hover {
    color: #b5b3b3;
    border: 1px solid #414141;
    box-shadow: 0 1px 0 #2f2f2f, 0 -3px 0 #414141 inset;
  }

  .nav-item:active {
    box-shadow: 0 1px 0 #2f2f2f, 0 -0.5px 0 #414141 inset;
  }

  .nav-item.active {
    color: #b5b3b3;
    border: 1px solid #414141;
    background-color: #262626;
    box-shadow: 0 1px 0 #2f2f2f, 0 -3px 0 #414141 inset;
  }
}
</style>
