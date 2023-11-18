<script setup lang="ts"></script>

<template>
  <div class="flex app-background pt-2 h-screen">
    <LayoutSidebar />
    <div class="main-container flex flex-1 p-4 rounded-tl-2xl shadow-sm border">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
