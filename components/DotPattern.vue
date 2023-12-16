<script setup lang="ts"></script>

<template>
  <div class="dot-pattern"></div>
</template>

<style scoped lang="scss">
.dot-pattern {
  position: absolute;
  inset: 0;

  background-image: radial-gradient(var(--dot-pattern-color) 1px, transparent 1px);
  background-size: 7px 7px;
  background-position: -8.5px -8.5px;
  opacity: 40%;

  mask-image: radial-gradient(ellipse at center, rgba(0, 0, 0, 1), transparent 85%);
}
</style>
