<script setup lang="ts"></script>

<template>
  <div class="flex app-background pt-2 h-screen">
    <LayoutSidebar />
    <div class="main-container overflow-y-auto flex flex-1 p-5 rounded-tl-2xl shadow-md border">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
