<script setup lang="ts">
import {cryptos} from "~/data/crypto";
</script>

<template>
  <LayoutSectionWrapper title="Dernières actus crypto" description="La Communauté affiche les dernières actus crypto publiées par les projets de tous les coins du monde crypto.">
    <div class="flex flex-col gap-3">
      <h2 class="text-xl font-bold">Recommandé</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <MainActu></MainActu>
      </div>
    </div>
  </LayoutSectionWrapper>
</template>

<style scoped lang="scss"></style>
