<script setup lang="ts">
import type { Crypto, UpsertCryptoDto } from "~/types/Crypto";

const { cryptos, loading, getLoading, fetchCryptos, upsertCrypto, deleteCrypto } = useCrypto();

const columns = [
  {
    key: "logo",
    label: "Logo",
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
    label: "Actions",
  },
];

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

// Selected Columns
const selectedColumns = ref(columns);
const columnsTable = computed(() => columns.filter((column) => selectedColumns.value.includes(column)));

// Pagination
/*const page = ref(1);
const pageCount = ref(10);
const pageTotal = computed(() => Math.ceil(filteredCryptos.value.length / pageCount.value));*/

// Filters
const search = ref("");

const filteredCryptos = computed(() =>
  cryptos.value.filter((crypto) => {
    const name = crypto.name.toLowerCase();
    const symbol = crypto.symbol.toLowerCase();
    const searchValue = search.value.toLowerCase();
    return name.includes(searchValue) || symbol.includes(searchValue);
  }),
);

/*const paginatedCryptos = computed(() => {
  const start = (page.value - 1) * pageCount.value;
  const end = start + pageCount.value;
  return filteredCryptos.value.slice(start, end);
});*/

onMounted(async () => {
  await fetchCryptos();
});
</script>

<template>
  <div class="flex flex-col gap-4 mt-1">
    <div class="flex justify-end sm:items-center gap-4 flex-col sm:flex-row">
      <UInput v-model="search" label="Search" placeholder="Search a crypto" icon="i-heroicons-magnifying-glass-20-solid" />
      <!--      <USelect v-model="pageCount" :options="[3, 5, 10, 20, 30, 40]" class="w-20" />-->
      <USelectMenu v-model="selectedColumns" :options="columns" multiple>
        <UButton icon="i-heroicons-view-columns" color="gray" class="w-full sm:w-40"> Columns </UButton>
      </USelectMenu>
      <UButton label="Add a crypto" icon="i-heroicons-plus-circle" @click="modal = true" />
    </div>
    <UTable :rows="filteredCryptos" :columns="columnsTable" :loading="getLoading">
      <template #logo-data="{ row }">
        <UAvatar :src="row.logo" :alt="row.name" class="w-7 h-7" :ui="{ rounded: 'rounded-none' }" />
      </template>
      <template #description-data="{ row }">
        <UPopover mode="hover">
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ row.description.slice(0, 50) }}...</span>
          <template #panel>
            <div class="p-4 w-96" style="white-space: pre-wrap">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ row.description }}</span>
            </div>
          </template>
        </UPopover>
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
    <!--    <UPagination v-model="page" :page-count="pageCount" :total="pageTotal" />-->
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
