<script setup lang="ts">
import type { Article, CreateArticleDto } from '~/types/Article'

const { articles, getLoading, fetchArticles, updateArticle, insertRssFeed, feeds, fetchFeed, fetchDailyArticles } = useArticle()
const search = ref('')
const columns = [
  {
    key: 'title',
    label: 'Title',
    sortable: true,
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
]

const columnsRssFeed = [
  {
    key: 'link',
    label: 'Link',
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
]

function addRssFeed() {
  if (search.value) {
    insertRssFeed(search.value)
  }
}

onMounted(() => {
  fetchArticles()
  fetchFeed()
})
</script>

<template>
  <div class="mt-1 flex flex-col gap-4">
    <div class="flex flex-col justify-end gap-4 sm:flex-row sm:items-center">
      <UInput v-model="search" label="Search" placeholder="Insert a new rss feed" icon="i-heroicons-magnifying-glass-20-solid" />
      <UButton label="Add RSS Feed" icon="i-heroicons-plus-circle" @click="addRssFeed()" />
      <UButton label="Get Articles" icon="i-heroicons-plus-circle" variant="soft" @click="fetchDailyArticles()" />
    </div>

    <UTable :rows="feeds" :columns="columnsRssFeed" :loading="getLoading">
      <template #title-data="{ row }">
        <UPopover mode="hover">
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ row.link.slice(0, 30) }}...</span>
          <template #panel>
            <div class="w-96 p-4" style="white-space: pre-wrap">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ row.link }}</span>
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
    </UTable>

    <UTable :rows="articles" :columns :loading="getLoading">
      <template #title-data="{ row }">
        <UPopover mode="hover">
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ row.title.slice(0, 30) }}...</span>
          <template #panel>
            <div class="w-96 p-4" style="white-space: pre-wrap">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ row.title }}</span>
            </div>
          </template>
        </UPopover>
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
          :name="row.visible ? 'i-heroicons-eye-20-solid' : 'i-heroicons-eye-slash-20-solid'"
          class="size-5 cursor-pointer"
          :class="row.visible ? 'text-green-500 dark:text-green-500' : 'text-red-500 dark:text-red-500'"
          @click="updateArticle(row.id, row.visible)"
        />
      </template>
    </UTable>
  </div>
</template>

<style scoped lang="scss"></style>
