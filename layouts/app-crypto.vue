<script setup lang="ts"></script>

<template>
  <div class="flex app-background pt-2 h-screen relative">
    <LayoutSidebar />
    <div class="main-container flex flex-1 overflow-y-auto p-5 rounded-tl-2xl shadow-md border border-gray-200 dark:border-gray-700">
      <slot />
    </div>
    <LayoutHelpCenter class="absolute bottom-3 right-2 sm:right-6" />
  </div>
</template>

<style scoped lang="scss"></style>
