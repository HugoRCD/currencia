<script setup lang="ts">
import { Role, type User } from '~~/types/User'

const loading = ref(false)
const updateLoading = ref(false)

const users = ref<User[]>([])
const search = ref('')

const filteredUsers = computed(() => {
  if (!search.value) return users.value
  return users.value.filter((user) => user.username.toLowerCase().includes(search.value.toLowerCase()))
})

async function fetchUsers() {
  loading.value = true
  const { data } = await useFetch('/api/admin/users/all')
  if (!data.value)
    toast.error('Whoops! Something went wrong.')
  if (data.value) users.value = data.value
  loading.value = false
}

async function deleteUser(id: number) {
  updateLoading.value = true
  const { data } = await useFetch(`/api/admin/users/${id}`, {
    method: 'DELETE',
  })
  if (!data.value) return
  toast.success('User deleted successfully.')
  updateLoading.value = false
  await fetchUsers()
}

async function changeUserRole(id: number, role: string) {
  updateLoading.value = true
  const { data } = await useFetch(`/api/admin/users/${id}`, {
    method: 'PUT',
    body: {
      role,
    },
  })
  if (!data.value) return
  toast.success('User role updated successfully.')
  updateLoading.value = false
  await fetchUsers()
}

const columns = [
  {
    key: 'avatar',
    label: 'Avatar',
  },
  {
    key: 'username',
    label: 'Username',
    sortable: true,
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
  },
  {
    key: 'role',
    label: 'Role',
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

const items = (row: User) => [
  [
    {
      label: 'Set as Admin',
      icon: 'heroicons:shield-check-20-solid',
      click: () => {
        if (row.role === Role.Admin) {
          toast.info('User is already an admin.')
          return
        }
        changeUserRole(row.id, Role.Admin)
      },
    },
    {
      label: 'Set as User',
      icon: 'heroicons:user-circle-20-solid',
      click: () => {
        changeUserRole(row.id, Role.User)
      },
    },
  ],
  [
    {
      label: 'Delete',
      icon: 'heroicons:trash-20-solid',
      iconClass: 'text-red-500 dark:text-red-500',
      click: () => {
        if (row.role === Role.Admin) {
          toast.error('You can\'t delete an admin.')
          return
        }
        deleteUser(row.id)
      },
    },
  ],
]

// Selected Columns
const selectedColumns = ref(columns)
const columnsTable = computed(() => columns.filter((column) => selectedColumns.value.includes(column)))

onMounted(async () => {
  await fetchUsers()
})
</script>

<template>
  <div class="mt-1 flex flex-col gap-4">
    <div class="flex flex-col justify-end gap-4 sm:flex-row sm:items-center">
      <UInput v-model="search" label="Search" placeholder="Search a user" icon="heroicons:magnifying-glass-20-solid" />
      <USelectMenu v-model="selectedColumns" :options="columns" multiple>
        <UButton icon="heroicons:view-columns" color="gray" class="w-full sm:w-40">
          Columns
        </UButton>
      </USelectMenu>
    </div>
    <UTable :rows="filteredUsers" :columns="columnsTable" :loading>
      <template #avatar-data="{ row }">
        <UAvatar :src="row.avatar" :alt="row.name" size="sm" img-class="object-cover" />
      </template>
      <template #role-data="{ row }">
        <UBadge :label="row.role.toUpperCase()" :color="row.role === 'admin' ? 'primary' : 'gray'" />
      </template>
      <template #createdAt-data="{ row }">
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(row.createdAt) }}</span>
      </template>
      <template #updatedAt-data="{ row }">
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(row.updatedAt) }}</span>
      </template>
      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton color="gray" variant="ghost" icon="heroicons:ellipsis-horizontal-20-solid" />
        </UDropdown>
      </template>
    </UTable>
  </div>
</template>

