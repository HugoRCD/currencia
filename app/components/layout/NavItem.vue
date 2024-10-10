<script setup lang="ts">
import type { PropType } from 'vue'

const { clear } = useUserSession()

type NavItem = {
  name: string;
  to: string;
  icon: string;
};

type NavItemProps = {
  navItem: NavItem;
  active: boolean;
  open: boolean;
};

defineProps<NavItemProps>()
</script>

<template>
  <div
    class="nav-item select-none"
    :class="{ active: active, logout: navItem.name === 'Logout' }"
    @click="navItem.name === 'Logout' ? clear() : $router.push(navItem.to)"
  >
    <span>
      <UIcon :name="navItem.icon" class="size-5 text-gray-500 dark:text-gray-400" />
    </span>
    <span v-if="open" class="hidden text-sm font-medium text-gray-500 sm:block dark:text-gray-400">
      {{ navItem.name }}
    </span>
  </div>
</template>

<style scoped>
.nav-item {
  --logout-color: #c12121;

  @apply cursor-pointer rounded-lg px-3 py-2 flex flex-row items-center gap-2 transition-transform duration-200 ease-in-out;
  border: 1px solid transparent;
  transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s, transform 0.2s;

  span {
    transform: translateY(-1.2px);
  }
}

.light {
  .nav-item:hover {
    color: #575757;
    border: 1px solid #ececec;
    box-shadow: 0 1px 0 #cccccc, 0 -3px 0 #ececec inset;

    &.logout {
      color: var(--logout-color);
      border: 1px solid var(--logout-color);
      box-shadow: 0 1px 0 var(--logout-color), 0 -3px 0 var(--logout-color) inset;
    }
  }

  .nav-item:active {
    box-shadow: 0 1px 0 #cccccc, 0 -0.5px 0 #ececec inset;

    &.logout {
      box-shadow: 0 1px 0 var(--logout-color), 0 -0.5px 0 var(--logout-color) inset;
    }
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

    &.logout {
      color: var(--logout-color);
      border: 1px solid var(--logout-color);
      box-shadow: 0 1px 0 var(--logout-color), 0 -3px 0 var(--logout-color) inset;
    }
  }

  .nav-item:active {
    box-shadow: 0 1px 0 #2f2f2f, 0 -0.5px 0 #414141 inset;

    span {
      transform: translateY(0.3px);
    }

    &.logout {
      box-shadow: 0 1px 0 var(--logout-color), 0 -0.5px 0 var(--logout-color) inset;
    }
  }

  .nav-item.active {
    color: #b5b3b3;
    border: 1px solid #414141;
    background-color: #262626;
    box-shadow: 0 1px 0 #2f2f2f, 0 -3px 0 #414141 inset;
  }
}
</style>
