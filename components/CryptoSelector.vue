<script setup lang="ts">
import { cryptos } from "~/data/crypto";

const selected = ref({ name: "Bitcoin", symbol: "BTC" });
</script>

<template>
  <div>
    <USelectMenu v-model="selected" :options="cryptos" searchable searchable-placeholder="Search for a crypto" :ui="{
      background: 'bg-[#FFFFFF] dark:bg-[#1C1C1E]',
      input: 'bg-[#FFFFFF] dark:bg-[#1C1C1E] border-[#E5E7EB] dark:border-[#303032]'
    }">
      <template #default="{ open }">
        <UButton color="gray" class="flex-1 justify-between">
          <div class="flex items-center space-x-2">
            <span class="flex-shrink-0 w-2 h-2 mt-px rounded-full" :style="{ background: `#${generateColorFromString(selected.name)}` }" />
            <span class="truncate">{{ selected.name }}</span>
          </div>
          <UIcon
              name="i-heroicons-chevron-right-20-solid"
              class="w-5 h-5 transition-transform text-gray-400 dark:text-gray-500"
              :class="[open && 'transform rotate-90']"
          />
        </UButton>
      </template>
      <template #option="{ option }">
        <span class="flex-shrink-0 w-2 h-2 mt-px rounded-full" :style="{ background: `#${generateColorFromString(option.name)}` }" />
        <span class="truncate">{{ option.name }}</span>
      </template>
    </USelectMenu>
  </div>
</template>

<style scoped lang="scss">

</style>