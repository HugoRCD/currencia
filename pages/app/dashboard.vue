<script setup lang="ts">
import { cryptos } from "~/data/crypto";

const categorie = [
  "01/01/2021 GMT",
  "01/02/2021 GMT",
  "01/03/2021 GMT",
  "01/04/2021 GMT",
  "01/05/2021 GMT",
  "01/06/2021 GMT",
  "01/07/2021 GMT",
  "01/08/2021 GMT",
  "01/09/2021 GMT",
  "01/10/2021 GMT",
  "01/11/2021 GMT",
  "01/12/2021 GMT",
  "01/13/2021 GMT",
  "01/14/2021 GMT",
  "01/15/2021 GMT",
  "01/16/2021 GMT",
  "01/17/2021 GMT",
  "01/18/2021 GMT",
  "01/19/2021 GMT",
  "01/20/2021 GMT",
  "01/21/2021 GMT",
  "01/22/2021 GMT",
  "01/23/2021 GMT",
  "01/24/2021 GMT",
  "01/25/2021 GMT",
  "01/26/2021 GMT",
  "01/27/2021 GMT",
  "01/28/2021 GMT",
  "01/29/2021 GMT",
  "01/30/2021 GMT",
  "01/31/2021 GMT",
  "02/01/2021 GMT",
  "02/02/2021 GMT",
  "02/03/2021 GMT",
  "02/04/2021 GMT",
  "02/05/2021 GMT",
  "02/06/2021 GMT",
  "02/07/2021 GMT",
  "02/08/2021 GMT",
  "02/09/2021 GMT",
  "02/10/2021 GMT",
  "02/11/2021 GMT",
  "02/12/2021 GMT",
  "02/13/2021 GMT",
  "02/14/2021 GMT",
  "02/15/2021 GMT",
  "02/16/2021 GMT",
  "02/17/2021 GMT",
  "02/18/2021 GMT",
  "02/19/2021 GMT",
];

const series = {
  data: [],
};

function smoothData(data: string | never[], windowSize: number) {
  const smoothedData = [];

  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    let count = 0;

    for (let j = Math.max(0, i - windowSize); j <= Math.min(data.length - 1, i + windowSize); j++) {
      sum += data[j];
      count++;
    }

    smoothedData.push(sum / count);
  }

  return smoothedData;
}

onMounted(() => {
  for (let i = 0; i < 50; i++) {
    const randomValue = Math.random() * 2000 - 1000;
    series.data.push(randomValue);
  }

  const windowSize = 5;
  series.data = smoothData(series.data, windowSize);
});
</script>

<template>
  <LayoutSectionWrapper title="Market overview" description="You can see all the market information, latest news, and more.">
    <!-- Crypto -->
    <div class="flex flex-col gap-3">
      <h2 class="text-xl font-bold">Latest Crypto Price</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ChartCryptoCard v-for="(crypto, index) in cryptos.slice(0, 12)" :key="crypto.name" :cryptoItem="crypto" :index="index" />
      </div>
    </div>

    <!-- Overall Chart -->
    <div class="flex flex-col gap-3 mt-8">
      <h2 class="text-xl font-bold">Overall Market Chart</h2>
      <ChartLine :categories="categorie" :series="series" />
    </div>

    <!-- Latest News -->
    <div class="flex flex-col gap-3 mt-8">
      <h2 class="text-xl font-bold">Latest News</h2>
      <div class="h-64 flex flex-col justify-center items-center">
        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200">No news yet.</h3>
        <span class="text-sm text-gray-500 dark:text-gray-400"> Please check back later. </span>
      </div>
    </div>
  </LayoutSectionWrapper>
</template>

<style scoped lang="scss"></style>
