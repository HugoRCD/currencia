<script setup lang="ts">
import { StarIcon } from '@heroicons/vue/24/outline'
import { StarIcon as filledStar } from '@heroicons/vue/24/solid'

definePageMeta({
  middleware: ['protected'],
})

const toast = useToast()

const loading = ref(false)

const { user } = useUserSession()
const userWatchlist = ref(user.value!.watchlist)
const cryptos = usePublicCrypto()

async function toggleFavorite(crypto: Crypto) {
  const { data, error } = await useFetch(`/api/user/crypto/${crypto.id}`, {
    method: 'POST',
    body: {
      userId: user.value!.id,
    },
  })
  if (error.value) {
    toast.add({
      title: 'Whoops! Something went wrong.',
      icon: 'heroicons:x-circle',
      color: 'red',
      timeout: 2000,
    })
    return
  }
  userWatchlist.value = data.value!.watchlist
  toast.add({
    title: userWatchlist.value.some((c) => c.cryptoId === crypto.id) ? 'Added to watchlist' : 'Removed from watchlist',
    icon: 'heroicons:check-circle',
    timeout: 2000,
  })
}

function isFavorite(crypto: Crypto) {
  if (!userWatchlist.value) return false
  return userWatchlist.value.some((c) => c.cryptoId === crypto.id)
}

async function updateCurrentUser() {
  if (!user.value) return
  loading.value = true
  await updateUser(user.value.id, user.value)
  loading.value = false
}
</script>

<template>
  <div class="flex flex-col gap-4 pb-4">
    <div style="--stagger: 1" data-animate class="flex flex-col gap-3">
      <form class="flex flex-col" @submit.prevent="updateCurrentUser">
        <h2 class="text-base font-semibold leading-7">
          Personal Information
        </h2>
        <p class="text-sm leading-6 text-gray-500">
          Use a permanent address where you can receive mail.
        </p>
        <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
        <div class="mt-6 flex justify-end gap-2">
          <UButton :loading type="submit">
            Save
          </UButton>
        </div>
      </form>
    </div>
    <div style="--stager: 2" data-animate class="flex flex-col gap-3">
      <div class="flex flex-col">
        <h2 class="text-base font-semibold leading-7">
          Cryptos
        </h2>
        <p class="text-sm leading-6 text-gray-500">
          Add your favorite cryptos.
        </p>
      </div>
      <div
        v-for="crypto in cryptos"
        :key="crypto.id"
        class="flex cursor-pointer items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm transition duration-200 ease-in-out hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
        @click="toggleFavorite(crypto)"
      >
        <div class="flex items-center gap-2">
          <UAvatar :src="crypto.logo" :alt="crypto.name" class="size-7" :ui="{ rounded: 'rounded-none' }" />
          <div class="flex flex-col">
            <h2 class="text-sm font-semibold">
              {{ crypto.name }}
            </h2>
            <p class="text-xs text-gray-500">
              {{ crypto.symbol }}
            </p>
          </div>
        </div>
        <div class="flex gap-2">
          <StarIcon v-if="!isFavorite(crypto)" class="size-5 text-gray-400" />
          <filledStar v-else class="size-5 text-yellow-400" />
        </div>
      </div>
    </div>
  </div>
</template>

