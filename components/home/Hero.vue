<script setup lang="ts">
import { cryptos } from "~/data/crypto";
</script>

<template>
  <div class="relative flex flex-col justify-center items-center">
    <!-- spotlight -->
    <div class="absolute rounded-full -z-1 bg-white/25 blur-[120px] lg:blur-[300px] inset-0"></div>

    <h1 class="text-center white-gradient font-display text-3xl font-light leading-tight lg:text-5xl">
      <span class="font-medium"> CURRENCIA<span class="text-primary">.</span> </span>
      <br />
      <span class="white-gradient font-medium text-2xl lg:text-4xl"> Stop searching for the best crypto tracker, you found it ! </span>
    </h1>
    <h2 class="mt-4 max-w-xl mx-auto text-center text-lg font-light text-black/60 dark:text-white/60">
      Currencia is a crypto tracker that allows you to follow your favorite cryptocurrencies and all the news about them.
    </h2>
    <HomeCircleSystem />
    <div class="flex gap-4 mt-6 z-10">
      <NuxtLink to="/app/dashboard">
        <UButton>
          <span class="font-semibold">Get started</span>
        </UButton>
      </NuxtLink>
    </div>
    <div class="flex gap-4 mt-6 z-10 relative">
      <div v-for="(crypto, index) in cryptos" :key="index" class="crypto-logo">
        <img :src="crypto.logo" class="w-8 h-8" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
