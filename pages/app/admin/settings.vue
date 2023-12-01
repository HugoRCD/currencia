<script setup lang="ts">
import type { CreateCryptoDto, UpdateCryptoDto } from "~/types/Crypto";
const { data, loading, refresh } = await useFetch("/api/admin/crypto/crypto");
const dayjs = useDayjs();
const toast = useToast();

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
];

const createLoading = ref(false);

function formatDate(date: string) {
  return dayjs(date).format("DD/MM/YYYY");
}

async function updateCrypto(id: string, updateCryptoDto: UpdateCryptoDto) {
  const { data, error } = await useFetch(`/api/admin/crypto/${id}`, {
    method: "PUT",
    body: updateCryptoDto,
  });
  if (error.value || !data.value)
    toast.add({
      title: "Whoops! Something went wrong.",
      icon: "i-heroicons-x-circle",
      color: "red",
      timeout: 2000,
    });
  toast.add({
    title: "Crypto updated successfully.",
    icon: "i-heroicons-check-circle",
    timeout: 2000,
  });
}

const newCrypto = ref<CreateCryptoDto>({
  name: "",
  symbol: "",
  logo: "",
  description: "",
  visible: true,
});

async function createCrypto() {
  createLoading.value = true;
  const { data, error } = await useFetch("/api/admin/crypto/crypto", {
    method: "POST",
    body: newCrypto.value,
  });
  if (error.value || !data.value)
    toast.add({
      title: "Whoops! Something went wrong.",
      icon: "i-heroicons-x-circle",
      color: "red",
      timeout: 2000,
    });
  toast.add({
    title: "Crypto created successfully.",
    icon: "i-heroicons-check-circle",
    timeout: 2000,
  });
  modal.value = false;
  newCrypto.value = {
    name: "",
    symbol: "",
    logo: "",
    description: "",
    visible: true,
  };
  createLoading.value = false;
  await refresh();
}

const modal = ref(false);
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-end">
      <UButton label="Add a crypto" icon="i-heroicons-plus-circle" @click="modal = true" />
    </div>
    <UTable :rows="data" :columns="columns" :loading="loading">
      <template #logo-data="{ row }">
        <UAvatar :src="row.logo" :alt="row.name" class="w-7 h-7" :ui="{ rounded: 'rounded-none' }" />
      </template>
      <template #description-data="{ row }">
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ row.description.slice(0, 50) }}...</span>s
      </template>
      <template #createdAt-data="{ row }">
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(row.createdAt) }}</span>
      </template>
      <template #updatedAt-data="{ row }">
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(row.updatedAt) }}</span>
      </template>
      <template #visible-data="{ row }">
        <UToggle
          v-model="row.visible"
          on-icon="i-heroicons-check-20-solid"
          off-icon="i-heroicons-x-mark-20-solid"
          @click="updateCrypto(row.id, { visible: !row.visible })"
        />
      </template>
    </UTable>
    <UModal v-model="modal" title="Update Crypto">
      <UCard>
        <div class="flex flex-col gap-4">
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
          <UButton label="Update" icon="i-heroicons-plus-circle" :loading="createLoading" @click="createCrypto" />
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<style scoped lang="scss"></style>
