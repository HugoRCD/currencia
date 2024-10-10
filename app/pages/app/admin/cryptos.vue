<script setup lang="ts">
import type { Crypto, UpsertCryptoDto } from '~~/types/Crypto'

const { modal, cryptos, loading, getLoading, fetchCryptos, upsertCrypto, deleteCrypto } = useCrypto()

const columns = [
  {
    key: 'logo',
    label: 'Logo',
  },
  {
    key: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    key: 'symbol',
    label: 'Symbol',
  },
  {
    key: 'description',
    label: 'Description',
  },
  {
    key: 'visible',
    label: 'Visible',
  },
  {
    key: 'createdAt',
    label: 'Created At',
    sortable: true,
  },
  {
    key: 'updatedAt',
    label: 'Updated At',
    sortable: true,
  },
  {
    key: 'actions',
    label: 'Actions',
  },
]

const items = (row: Crypto) => [
  [
    {
      label: 'Edit',
      icon: 'heroicons:pencil-square-20-solid',
      click: () => {
        modal.value = true
        newCrypto.value = {
          name: row.name,
          symbol: row.symbol,
          logo: row.logo,
          description: row.description,
          visible: row.visible,
        }
      },
    },
    {
      label: row.visible ? 'Hide' : 'Show',
      icon: row.visible ? 'heroicons:eye-slash-20-solid' : 'heroicons:eye-20-solid',
      click: () => {
        upsertCrypto({ ...row, visible: !row.visible })
      },
    },
  ],
  [
    {
      label: 'Delete',
      icon: 'heroicons:trash-20-solid',
      iconClass: 'text-red-500 dark:text-red-500',
      click: () => {
        deleteCrypto(row.id)
      },
    },
  ],
]

const newCrypto = ref<UpsertCryptoDto>({
  name: '',
  symbol: '',
  logo: '',
  description: '',
  visible: true,
})

// Selected Columns
const selectedColumns = ref(columns)
const columnsTable = computed(() => columns.filter((column) => selectedColumns.value.includes(column)))

// Pagination
/*const page = ref(1);
const pageCount = ref(10);
const pageTotal = computed(() => Math.ceil(filteredCryptos.value.length / pageCount.value));*/

// Filters
const search = ref('')

const filteredCryptos = computed(() =>
  cryptos.value.filter((crypto) => {
    const name = crypto.name.toLowerCase()
    const symbol = crypto.symbol.toLowerCase()
    const searchValue = search.value.toLowerCase()
    return name.includes(searchValue) || symbol.includes(searchValue)
  }),
)

/*const paginatedCryptos = computed(() => {
  const start = (page.value - 1) * pageCount.value;
  const end = start + pageCount.value;
  return filteredCryptos.value.slice(start, end);
});*/

onMounted(async () => {
  await fetchCryptos()
})
</script>

<template>
  <div class="mt-1 flex flex-col gap-4">
    <div class="flex flex-col justify-end gap-4 sm:flex-row sm:items-center">
      <UInput v-model="search" label="Search" placeholder="Search a crypto" icon="heroicons:magnifying-glass-20-solid" />
      <!--      <USelect v-model="pageCount" :options="[3, 5, 10, 20, 30, 40]" class="w-20" />-->
      <USelectMenu v-model="selectedColumns" :options="columns" multiple>
        <UButton icon="heroicons:view-columns" color="gray" class="w-full sm:w-40">
          Columns
        </UButton>
      </USelectMenu>
      <UButton label="Add a crypto" icon="heroicons:plus-circle" @click="modal = true" />
    </div>
    <UTable :rows="filteredCryptos" :columns="columnsTable" :loading="getLoading">
      <template #logo-data="{ row }">
        <UAvatar :src="row.logo" :alt="row.name" class="size-7" :ui="{ rounded: 'rounded-none' }" />
      </template>
      <template #description-data="{ row }">
        <UPopover mode="hover">
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ row.description.slice(0, 50) }}...</span>
          <template #panel>
            <div class="w-96 p-4" style="white-space: pre-wrap">
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
          :name="row.visible ? 'heroicons:eye-20-solid' : 'heroicons:eye-slash-20-solid'"
          class="size-5"
          :class="row.visible ? 'text-green-500 dark:text-green-500' : 'text-red-500 dark:text-red-500'"
        />
      </template>
      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton color="gray" variant="ghost" icon="heroicons:ellipsis-horizontal-20-solid" />
        </UDropdown>
      </template>
    </UTable>
    <!--    <UPagination v-model="page" :page-count="pageCount" :total="pageTotal" />-->
    <UModal v-model="modal">
      <UCard>
        <form class="flex flex-col gap-4" @submit.prevent="upsertCrypto(newCrypto)">
          <div class="flex justify-center">
            <UAvatar :src="newCrypto.logo" class="size-24" />
          </div>
          <UFormGroup label="Name">
            <UInput v-model="newCrypto.name" placeholder="Bitcoin" />
          </UFormGroup>
          <UFormGroup label="Symbol">
            <UInput v-model="newCrypto.symbol" placeholder="BTC" />
          </UFormGroup>
          <UFormGroup label="Logo">
            <UInput v-model="newCrypto.logo" placeholder="https://example.com/logo.png" />
          </UFormGroup>
          <UFormGroup label="Description">
            <UTextarea
              v-model="newCrypto.description"
              label="Description"
              placeholder="Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group of people using the name Satoshi Nakamoto."
              autoresize
            />
          </UFormGroup>
          <UButton label="Save" icon="heroicons:plus-circle" :loading type="submit" />
        </form>
      </UCard>
    </UModal>
  </div>
</template>

