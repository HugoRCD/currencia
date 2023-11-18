<script setup lang="ts">
import { cryptos } from "~/data/crypto";
</script>

<template>
  <LayoutSectionWrapper title="Market overview" description="You can see all the market information, latest news, and more.">
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <ChartCrypto v-for="(crypto, index) in cryptos" :key="crypto.name" :cryptoItem="crypto" :index="index" />
    </div>
  </LayoutSectionWrapper>
</template>

<style scoped lang="scss"></style>
