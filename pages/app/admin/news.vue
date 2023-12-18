<script setup lang="ts">
import type { Article } from "~/types/Article";
import type { CreateArticleDto } from "~/types/Article";

const { articles, getLoading, fetchArticles, updateArticle } = useArticle();

const columns = [
  {
    key: "title",
    label: "Title",
    sortable: true,
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

onMounted(() => {
  fetchArticles();
});
</script>

<template>
  <div class="flex flex-col gap-4 mt-1">
    <UTable :rows="articles" :columns="columns" :loading="getLoading">
      <template #title-data="{ row }">
        <UPopover mode="hover">
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ row.title.slice(0, 30) }}...</span>
          <template #panel>
            <div class="p-4 w-96" style="white-space: pre-wrap">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ row.title }}</span>
            </div>
          </template>
        </UPopover>
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
          class="w-5 h-5 cursor-pointer"
          :class="row.visible ? 'text-green-500 dark:text-green-500' : 'text-red-500 dark:text-red-500'"
          @click="updateArticle(row.id, row.visible)"
        />
      </template>
    </UTable>
  </div>
</template>

<style scoped lang="scss"></style>
