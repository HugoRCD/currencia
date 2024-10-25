<script setup lang="ts">
type SectionWrapperProps = {
  navigation: Navigation | null;
};

defineProps<SectionWrapperProps>()
</script>

<template>
  <div class="main-container flex flex-1 flex-col overflow-hidden rounded-t-2xl border-x border-t border-neutral-300 shadow-md dark:border-neutral-800">
    <div class="flex justify-between gap-1 border-b border-inherit px-5 py-2">
      <div class="flex items-center gap-2">
        <template v-if="navigation">
          <Transition name="slide-to-bottom" mode="out-in">
            <UIcon :key="navigation.icon" :name="navigation.icon" class="size-5 font-bold" />
          </Transition>
          <Transition name="slide-to-top" mode="out-in">
            <h1 :key="navigation.title" class="text-xl font-bold">
              {{ navigation.title }}
            </h1>
          </Transition>
        </template>
      </div>
      <div class="flex items-center gap-2 sm:hidden">
        <User />
      </div>
    </div>
    <div class="custom-overflow mt-4 flex flex-col gap-4 overflow-y-auto px-4">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.custom-overflow {
  &::-webkit-scrollbar {
    width: 0;
  }
}
</style>
