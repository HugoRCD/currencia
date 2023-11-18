!c
<script setup lang="ts">
import type { PropType } from "vue";
import type { Crypto } from "~/data/crypto";

const props = defineProps({
  cryptoItem: {
    type: Object as PropType<Crypto>,
    required: true,
  },
});

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const crypto = reactive({
  name: props.cryptoItem.name,
  symbol: props.cryptoItem.symbol,
  price: getRandomInt(1000),
  change: getRandomInt(100),
});
</script>

<template>
  <div class="flex flex-col gap-2 p-4 rounded-xl shadow-sm border">
    <div class="flex flex-row items-center justify-between">
      <div class="flex flex-row items-center gap-2">
        <div class="flex flex-col">
          <span class="text-sm font-medium">{{ crypto.name }}</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ crypto.symbol }}</span>
        </div>
      </div>
      <div class="flex flex-row items-center gap-2">
        <span class="text-sm font-medium">{{ crypto.price }}</span>
        <span
          class="text-xs font-medium rounded-full px-2 py-0.5"
          :class="{
            'bg-green-100 text-green-500': crypto.change > 0,
            'bg-red-100 text-red-500': crypto.change < 0,
          }"
        >
          {{ crypto.change }}%
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
