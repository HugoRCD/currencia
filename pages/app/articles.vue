<script setup lang="ts">
const articles = [
  {
    id: 1,
    title: "Bitcoin",
    description:
      "Bitcoin is a decentralized electronic currency designed in 2009 by the pseudonym Satoshi Nakamoto. Based on the principle of blockchain, the value of this virtual currency has skyrocketed in recent years.",
    image: "https://academy-public.coinmarketcap.com/srd-optimized-uploads/33904065b769440fa27fcb78b868148a.png",
    date: "01/01/2021 GMT",
  },
  {
    id: 2,
    title: "Ethereum",
    description:
      "Ethereum is a decentralized platform that enables the creation of smart contracts through blockchain technology. It was created in 2015 by Vitalik Buterin, a Canadian developer of Russian origin.",
    image: "https://academy-public.coinmarketcap.com/srd-optimized-uploads/660cff40603a4da9a9fdaf0ffda5755d.png",
    date: "01/02/2021 GMT",
  },
  {
    id: 3,
    title: "Cardano",
    description:
      "Cardano is an open-source blockchain platform that allows the execution of smart contracts and decentralized applications. It was created in 2017 by Charles Hoskinson, one of the co-founders of Ethereum.",
    image: "https://academy-public.coinmarketcap.com/srd-optimized-uploads/9b207c452f2f469892569653b035cb86.png",
    date: "01/03/2021 GMT",
  },
];
</script>

<template>
  <div class="w-full">
    <div class="flex flex-col gap-3">
      <NewsMainActu :articles="articles" />
      <NewsListActu :articles="articles" class="mt-8" />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
