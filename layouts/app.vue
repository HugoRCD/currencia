<script setup lang="ts"></script>

<template>
  <div class="flex app-background pt-2 h-screen">
    <LayoutSidebar />
    <div class="main-container flex flex-1 overflow-y-auto p-5 rounded-tl-2xl shadow-md border border-gray-200 dark:border-gray-700">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
