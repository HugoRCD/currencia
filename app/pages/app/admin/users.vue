<script setup lang="ts">
import type { User } from "~/types/User";
import { Role } from "~/types/User";
const toast = useToast();

const loading = ref(false);
const updateLoading = ref(false);

const users = ref<User[]>([]);
const search = ref("");

const filteredUsers = computed(() => {
  if (!search.value) return users.value;
  return users.value.filter((user) => user.username.toLowerCase().includes(search.value.toLowerCase()));
});

async function fetchUsers() {
  loading.value = true;
  const { data } = await useFetch("/api/admin/users/all");
  if (!data.value)
    toast.add({
      title: "Whoops! Something went wrong.",
      icon: "i-heroicons-x-circle",
      color: "red",
      timeout: 2000,
    });
  if (data.value) users.value = data.value;
  loading.value = false;
}

async function deleteUser(id: number) {
  updateLoading.value = true;
  const { data } = await useFetch(`/api/admin/users/${id}`, {
    method: "DELETE",
  });
  if (!data.value) return;
  toast.add({
    title: "User deleted successfully.",
    icon: "i-heroicons-check-circle",
    color: "green",
    timeout: 2000,
  });
  updateLoading.value = false;
  await fetchUsers();
}

async function changeUserRole(id: number, role: string) {
  updateLoading.value = true;
  const { data } = await useFetch(`/api/admin/users/${id}`, {
    method: "PUT",
    body: {
      role,
    },
  });
  if (!data.value) return;
  toast.add({
    title: "User role updated successfully.",
    icon: "i-heroicons-check-circle",
    color: "green",
    timeout: 2000,
  });
  updateLoading.value = false;
  await fetchUsers();
}

const columns = [
  {
    key: "avatar",
    label: "Avatar",
  },
  {
    key: "username",
    label: "Username",
    sortable: true,
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
  },
  {
    key: "role",
    label: "Role",
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

const items = (row: User) => [
  [
    {
      label: "Set as Admin",
      icon: "i-heroicons-shield-check-20-solid",
      click: () => {
        if (row.role === Role.Admin) {
          toast.add({
            title: "User is already an admin.",
            icon: "i-heroicons-information-circle",
            color: "blue",
            timeout: 2000,
          });
          return;
        }
        changeUserRole(row.id, Role.Admin);
      },
    },
    {
      label: "Set as User",
      icon: "i-heroicons-user-circle-20-solid",
      click: () => {
        changeUserRole(row.id, Role.User);
      },
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      iconClass: "text-red-500 dark:text-red-500",
      click: () => {
        if (row.role === Role.Admin) {
          toast.add({
            title: "You can't delete an admin.",
            icon: "i-heroicons-information-circle",
            color: "blue",
            timeout: 2000,
          });
          return;
        }
        deleteUser(row.id);
      },
    },
  ],
];

// Selected Columns
const selectedColumns = ref(columns);
const columnsTable = computed(() => columns.filter((column) => selectedColumns.value.includes(column)));

onMounted(async () => {
  await fetchUsers();
});
</script>

<template>
  <div class="flex flex-col gap-4 mt-1">
    <div class="flex justify-end sm:items-center gap-4 flex-col sm:flex-row">
      <UInput v-model="search" label="Search" placeholder="Search a user" icon="i-heroicons-magnifying-glass-20-solid" />
      <USelectMenu v-model="selectedColumns" :options="columns" multiple>
        <UButton icon="i-heroicons-view-columns" color="gray" class="w-full sm:w-40"> Columns </UButton>
      </USelectMenu>
    </div>
    <UTable :rows="filteredUsers" :columns="columnsTable" :loading="loading">
      <template #avatar-data="{ row }">
        <UAvatar :src="row.avatar" :alt="row.name" size="sm" imgClass="object-cover" />
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
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
        </UDropdown>
      </template>
    </UTable>
  </div>
</template>

<style scoped lang="scss"></style>
