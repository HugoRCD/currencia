<script setup lang="ts">
import type { UpsertCryptoDto, Crypto } from "~/types/Crypto";

const columns = [
  {
    key: "logo",
    label: "",
  },
  {
    key: "name",
    label: "Name",
    sortable: true,
  },
  {
    key: "symbol",
    label: "Symbol",
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "visible",
    label: "Visible",
  },
  {
    key: "createdAt",
    label: "Created At",
    sortable: true,
  },
  {
    key: "updatedAt",
    label: "Updated At",
    sortable: true,
  },
  {
    key: "actions",
  },
];

const { cryptos, loading, getLoading, fetchCryptos, upsertCrypto, deleteCrypto } = useCrypto();

const items = (row: Crypto) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => {
        modal.value = true;
        newCrypto.value = {
          name: row.name,
          symbol: row.symbol,
          logo: row.logo,
          description: row.description,
          visible: row.visible,
        };
      },
    },
    {
      label: row.visible ? "Hide" : "Show",
      icon: row.visible ? "i-heroicons-eye-slash-20-solid" : "i-heroicons-eye-20-solid",
      click: () => {
        upsertCrypto({ ...row, visible: !row.visible });
      },
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      iconClass: "text-red-500 dark:text-red-500",
      click: () => {
        deleteCrypto(row.id);
      },
    },
  ],
];

const newCrypto = ref<UpsertCryptoDto>({
  name: "",
  symbol: "",
  logo: "",
  description: "",
  visible: true,
});

const modal = ref(false);

onMounted(async () => {
  await fetchCryptos();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-end">
      <UButton label="Add a crypto" icon="i-heroicons-plus-circle" @click="modal = true" />
    </div>
    <UTable :rows="cryptos" :columns="columns" :loading="getLoading">
      <template #logo-data="{ row }">
        <UAvatar :src="row.logo" :alt="row.name" class="w-7 h-7" :ui="{ rounded: 'rounded-none' }" />
      </template>
      <template #description-data="{ row }">
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ row.description.slice(0, 50) }}...</span>
      </template>
      <template #createdAt-data="{ row }">
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(row.createdAt) }}</span>
      </template>
      <template #updatedAt-data="{ row }">
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(row.updatedAt) }}</span>
      </template>
      <template #visible-data="{ row }">
        <UIcon
          :name="row.visible ? 'i-heroicons-eye-20-solid' : 'i-heroicons-eye-slash-20-solid'"
          class="w-5 h-5"
          :class="row.visible ? 'text-green-500 dark:text-green-500' : 'text-red-500 dark:text-red-500'"
        />
      </template>
      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
        </UDropdown>
      </template>
    </UTable>
    <UModal v-model="modal">
      <UCard>
        <form class="flex flex-col gap-4" @submit.prevent="upsertCrypto(newCrypto)">
          <div class="flex justify-center">
            <UAvatar :src="newCrypto.logo" class="w-24 h-24" />
          </div>
          <UInput v-model="newCrypto.name" label="Name" placeholder="Bitcoin" />
          <UInput v-model="newCrypto.symbol" label="Symbol" placeholder="BTC" />
          <UInput v-model="newCrypto.logo" label="Logo" placeholder="https://example.com/logo.png" />
          <UTextarea
            v-model="newCrypto.description"
            label="Description"
            placeholder="Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group of people using the name Satoshi Nakamoto."
            autoresize
          />
          <UButton label="Save" icon="i-heroicons-plus-circle" :loading="loading" type="submit" />
        </form>
      </UCard>
    </UModal>
  </div>
</template>

<style scoped lang="scss"></style>
