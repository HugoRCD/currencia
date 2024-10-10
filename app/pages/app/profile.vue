<script setup lang="ts">
import { StarIcon } from "@heroicons/vue/24/outline";
import { StarIcon as filledStar } from "@heroicons/vue/24/solid";
import type { Crypto } from "~/types/Crypto";
import type { publicUser } from "~/types/User";

const toast = useToast();

const loading = ref(false);

const user = useCurrentUser();
const userWatchlist = ref(user.value!.watchlist);
const cryptos = usePublicCrypto();

async function togglefavorite(crypto: Crypto) {
  const { data, error } = await useFetch<publicUser>(`/api/user/crypto/${crypto.id}`, {
    method: "POST",
    body: {
      userId: user.value!.id,
    },
  });
  if (error.value) {
    toast.add({
      title: "Whoops! Something went wrong.",
      icon: "i-heroicons-x-circle",
      color: "red",
      timeout: 2000,
    });
    return;
  }
  userWatchlist.value = data.value!.watchlist;
  toast.add({
    title: userWatchlist.value.some((c) => c.cryptoId === crypto.id) ? "Added to watchlist" : "Removed from watchlist",
    icon: "i-heroicons-check-circle",
    timeout: 2000,
  });
}

function isFavorite(crypto: Crypto) {
  if (!userWatchlist.value) return false;
  return userWatchlist.value.some((c) => c.cryptoId === crypto.id);
}

async function updateCurrentUser() {
  if (!user.value) return;
  loading.value = true;
  await updateUser(user.value.id, user.value);
  loading.value = false;
}
</script>

<template>
  <div class="pb-4 flex flex-col gap-4">
    <div style="--stagger: 1" data-animate class="flex flex-col gap-3">
      <form class="flex flex-col" @submit.prevent="updateCurrentUser">
        <h2 class="text-base font-semibold leading-7">Personal Information</h2>
        <p class="text-sm leading-6 text-gray-500">Use a permanent address where you can receive mail.</p>
        <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-6">
          <div class="sm:col-span-3">
            <label for="first-name" class="block text-sm font-medium leading-6"> Username </label>
            <div class="mt-2">
              <UInput v-model="user!.username" />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="email" class="block text-sm font-medium leading-6"> Email address </label>
            <div class="mt-2">
              <UInput v-model="user!.email" disabled />
            </div>
          </div>

          <div class="sm:col-span-4">
            <label for="last-name" class="block text-sm font-medium leading-6"> Avatar </label>
            <div class="mt-2">
              <UInput v-model="user!.avatar" />
            </div>
          </div>
        </div>
        <div class="flex gap-2 justify-end mt-6">
          <UButton :loading="loading" type="submit">Save</UButton>
        </div>
      </form>
    </div>
    <div style="--stager: 2" data-animate class="flex flex-col gap-3">
      <div class="flex flex-col">
        <h2 class="text-base font-semibold leading-7">Cryptos</h2>
        <p class="text-sm leading-6 text-gray-500">Add your favorite cryptos.</p>
      </div>
      <div
        v-for="crypto in cryptos"
        :key="crypto.id"
        @click="togglefavorite(crypto)"
        class="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 ease-in-out flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm py-2 px-3"
      >
        <div class="flex gap-2 items-center">
          <UAvatar :src="crypto.logo" :alt="crypto.name" class="w-7 h-7" :ui="{ rounded: 'rounded-none' }" />
          <div class="flex flex-col">
            <h2 class="text-sm font-semibold">{{ crypto.name }}</h2>
            <p class="text-xs text-gray-500">{{ crypto.symbol }}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <StarIcon v-if="!isFavorite(crypto)" class="w-5 h-5 text-gray-400" />
          <filledStar v-else class="w-5 h-5 text-yellow-400" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
