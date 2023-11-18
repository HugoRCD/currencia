<script setup lang="ts">
import type { PropType } from "vue";

defineProps({
  item: {
    type: Object as PropType<{
      id: string;
      title: string;
      description: string;
      image: string;
    }>,
    required: true,
  },
});
</script>

<template>

</template>

<style scoped lang="scss"></style>
