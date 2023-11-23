<script setup lang="ts"></script>

<template>
  <div class="flex h-screen pt-2 max-layout-width">
    <LayoutSidebar />
    <div class="main-container flex flex-col flex-1 custom-overflow overflow-y-auto rounded-t-2xl shadow-md border border-inherit">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
