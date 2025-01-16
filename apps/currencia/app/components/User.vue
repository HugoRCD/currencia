<script setup lang="ts">
import { updateUser } from '~/composables/useUser'

defineProps({
  sideBarOpen: {
    type: Boolean,
    default: true,
  },
})

const route = useRoute()

if (route.query.error === 'github') {
  toast.error('An error occurred while logging in with GitHub.', {
    duration: Infinity,
    closeButton: false,
    action: {
      label: 'Dismiss',
      onClick: () => useRouter().push('/app/market')
    }
  })
}

const loading = ref(false)
const authModal = ref(false)

const { user, fetch, clear } = useUserSession()

const open = ref(false)
const router = useRouter()

async function logout() {
  await router.push('/app/market')
  await clear()
  authModal.value = false
}

async function updateCurrentUser() {
  if (!user.value) return
  loading.value = true
  await updateUser(user.value.id, user.value)
  loading.value = false
  open.value = false
}
</script>

<template>
  <div class="flex w-full items-center gap-2" :class="sideBarOpen ? 'justify-center sm:justify-between' : 'justify-center'">
    <div v-if="user">
      <UButton
        color="white"
        variant="soft"
        size="sm"
        class="text-left font-semibold"
        :ui="{ padding: { sm: 'px-0' } }"
        @click="open = true"
      >
        <UAvatar size="sm" :src="user.avatar" img-class="object-cover" />
        <span class="whitespace-nowrap" :class="sideBarOpen ? 'hidden sm:flex' : 'hidden'">
          {{ user.username }}
        </span>
      </UButton>
      <UModal v-model="open">
        <UCard>
          <div class="flex flex-col gap-3">
            <div class="flex flex-col items-center justify-center gap-3">
              <UAvatar :src="user.avatar" size="3xl" img-class="object-cover" />
              <div class="flex flex-col items-center justify-center gap-1">
                <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                  Welcome back, {{ user.username }}
                </h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Here you can edit your information.
                </p>
              </div>
            </div>
            <form class="space-y-3" @submit.prevent="updateCurrentUser">
              <UFormGroup label="Avatar" name="avatar">
                <UInput v-model="user.avatar" />
              </UFormGroup>
              <UFormGroup label="Username" name="username">
                <UInput v-model="user.username" />
              </UFormGroup>
              <UFormGroup label="Email" name="name">
                <UInput v-model="user.email" disabled />
              </UFormGroup>
              <div class="flex justify-between gap-2 pt-4">
                <UButton variant="soft" color="red" @click="logout">
                  Logout
                </UButton>
                <div class="flex gap-2">
                  <UButton variant="soft" @click="open = false">
                    Cancel
                  </UButton>
                  <UButton :loading type="submit">
                    Save
                  </UButton>
                </div>
              </div>
            </form>
          </div>
        </UCard>
      </UModal>
    </div>
    <div v-else>
      <UButton
        color="white"
        variant="soft"
        size="sm"
        class="text-left font-semibold"
        :ui="{ padding: { sm: 'px-0' } }"
        @click="authModal = true"
      >
        <UAvatar icon="heroicons:user-circle" size="sm" :ui="{ icon: { size: { sm: 'w-5 h-5' } } }" />
        <span class="whitespace-nowrap" :class="sideBarOpen ? 'hidden sm:flex' : 'hidden'">Sign / Signup</span>
      </UButton>
      <UModal v-model="authModal">
        <UCard>
          <div class="flex flex-col gap-3">
            <div class="flex flex-col items-center justify-center gap-1">
              <UAvatar size="3xl" icon="heroicons:user-circle" />
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Welcome
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Please sign in or sign up to continue.
              </p>
            </div>
            <div class="mt-2 flex justify-center">
              <a href="/auth/github" class="flex items-center gap-2 rounded-md bg-gray-200 px-5 py-1.5 text-sm text-black transition-colors duration-300 hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                <UIcon name="simple-icons:github" class="size-5" />
                <span>
                  Sign in with GitHub
                </span>
              </a>
            </div>
          </div>
        </UCard>
      </UModal>
    </div>
  </div>
</template>

