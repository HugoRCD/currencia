<script setup lang="ts"></script>

<template>
  <div class="relative flex flex-col items-center justify-center">
    <!-- spotlight -->
    <div class="-z-1 absolute inset-0 rounded-full bg-white/10 blur-[120px] lg:blur-[180px]" />
    <img src="/assets/currencia-logo.png" class="z-10 size-16" alt="Currencia logo">
    <h1 class="white-gradient font-display z-10 mt-4 text-center text-3xl font-light leading-tight lg:text-5xl">
      <span class="font-medium"> CURRENCIA<span class="text-primary">.</span> </span>
      <br>
      <span class="white-gradient text-2xl font-medium lg:text-4xl"> Stop searching for the best crypto tracker, you found it ! </span>
    </h1>
    <h2 class="mx-auto mt-4 max-w-xl text-center text-lg font-light text-black/60 dark:text-white/60">
      Currencia is a crypto tracker that allows you to follow your favorite cryptocurrencies and all the news about them.
    </h2>
    <HomeCircleSystem />
    <div class="z-10 mt-6 flex gap-4">
      <NuxtLink to="/app/market">
        <UButton>
          <span class="font-semibold">Get started</span>
        </UButton>
      </NuxtLink>
    </div>
    <!--    <div class="flex gap-4 mt-6 z-10 relative">
      <div v-for="(crypto, index) in cryptos" :key="index" class="crypto-logo">
        <img :src="crypto.logo" class="w-8 h-8" alt="" />
      </div>
    </div>-->
  </div>
</template>

