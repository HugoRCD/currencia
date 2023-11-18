<script setup lang="ts">
import { cryptos } from "~/data/crypto";
</script>

<template>
  <LayoutSectionWrapper title="Market overview" description="You can see all the market information, latest news, and more.">
    <!-- Crypto -->
    <div class="flex flex-col gap-3">
      <h2 class="text-xl font-bold">Latest Crypto Price</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ChartCrypto v-for="(crypto, index) in cryptos" :key="crypto.name" :cryptoItem="crypto" :index="index" />
      </div>
    </div>

    <!-- Overall Chart -->
    <div class="flex flex-col gap-3 mt-4">
      <h2 class="text-xl font-bold">Overall Chart</h2>
      <ChartLine />
    </div>

    <!-- Latest News -->
    <div class="flex flex-col gap-3 mt-4">
      <h2 class="text-xl font-bold">Latest News</h2>
    </div>
  </LayoutSectionWrapper>
</template>

<style scoped lang="scss"></style>
