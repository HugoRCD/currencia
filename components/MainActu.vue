<script setup lang="ts">
const articles = [
  {
    id: 1,
    title: "Bitcoin",
    description: "Bitcoin est une monnaie électronique décentralisée conçue en 2009 par le pseudonyme Satoshi Nakamoto. Basée sur le principe de la blockchain, la valeur de cette monnaie virtuelle a explosé ces dernières années.",
    image: "https://academy-public.coinmarketcap.com/srd-optimized-uploads/33904065b769440fa27fcb78b868148a.png",
    date: "01/01/2021 GMT",
  },
  {
    id: 2,
    title: "Ethereum",
    description: "Ethereum est une plateforme décentralisée qui permet de créer des contrats intelligents grâce à la technologie blockchain. Elle a été créée en 2015 par Vitalik Buterin, un développeur canadien d’origine russe.",
    image: "https://academy-public.coinmarketcap.com/srd-optimized-uploads/660cff40603a4da9a9fdaf0ffda5755d.png",
    date: "01/02/2021 GMT",
  },
  {
    id: 3,
    title: "Cardano",
    description: "Cardano est une plateforme de blockchain open source qui permet d’exécuter des contrats intelligents et des applications décentralisées. Elle a été créée en 2017 par Charles Hoskinson, un des cofondateurs d’Ethereum.",
    image: "https://academy-public.coinmarketcap.com/srd-optimized-uploads/9b207c452f2f469892569653b035cb86.png",
    date: "01/03/2021 GMT",
  },
];

</script>

<template>
  <div class="flex flex-col gap-3">
    <h2 class="text-xl font-bold">Latest Crypto Price</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <ChartActu v-for="(article, index) in articles" :key="index" :article="article" :index="index" />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
