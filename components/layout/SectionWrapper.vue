<script setup lang="ts">
import type { Navigation } from "~/composables/useNavigation";
import type { PropType } from "vue";

defineProps({
  navigation: {
    type: Object as PropType<Navigation>,
    required: true,
  },
});
</script>

<template>
  <div class="main-container flex flex-col flex-1 overflow-y-auto rounded-tl-2xl shadow-md border border-inherit">
    <div class="flex flex-col gap-1 border-b border-inherit px-5 py-2">
      <div class="flex gap-2 items-center">
        <Transition name="slide-to-bottom" mode="out-in">
          <component :is="navigation.icon" class="w-5 h-5 font-bold" :key="navigation.icon" />
        </Transition>
        <Transition name="slide-to-top" mode="out-in">
          <h1 class="text-xl font-bold" :key="navigation.title">
            {{ navigation.title }}
          </h1>
        </Transition>
      </div>
    </div>
    <div class="flex flex-col gap-4 px-4 mt-6">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
