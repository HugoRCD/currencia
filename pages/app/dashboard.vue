<script setup lang="ts">
import { cryptos } from "~/data/crypto";
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-2xl font-bold">Dashboard</h1>
    <hr class="border-gray-300 dark:border-gray-700 border-1 rounded-lg w-full mx-auto mt-1 mb-3" />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ChartCrypto v-for="crypto in cryptos" :key="crypto.name" :cryptoItem="crypto" />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
