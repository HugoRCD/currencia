<script setup lang="ts">
/*const user = ref({
  username: "HugoRCD",
  email: "hrichard206@gmail.com",
  avatar: "https://hrcd.fr/_vercel/image?url=/assets/hugo-richard-light.webp&w=256&q=100",
});*/

const user = ref();

const login = {
  username: "HugoRCD",
  password: "",
};

const signup = {
  username: "HugoRCD",
  email: "",
  password: "",
};

const items = [
  {
    slot: "login",
    label: "Sign in",
  },
  {
    slot: "signup",
    label: "Sign up",
  },
];

const open = ref(false);
const authModal = ref(false);
</script>

<template>
  <div class="flex-1">
    <div class="flex-1" v-if="user">
      <UButton color="white" variant="soft" size="sm" class="flex-1 text-left font-semibold" @click="open = true">
        <UAvatar size="sm" :src="user.avatar" />
        <span class="whitespace-nowrap">
          {{ user.username }}
        </span>
      </UButton>
      <UModal v-model="open">
        <UCard>
          <div class="flex flex-col gap-3">
            <div class="flex flex-col justify-center items-center gap-3">
              <UAvatar :src="user.avatar" size="3xl" imgClass="object-cover" />
              <div class="flex flex-col justify-center items-center gap-1">
                <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Welcome back, {{ user.username }}</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Here you can edit your information.</p>
              </div>
            </div>
            <form class="space-y-3">
              <UFormGroup label="Avatar" name="avatar">
                <UInput v-model="user.avatar" />
              </UFormGroup>
              <UFormGroup label="Username" name="username">
                <UInput v-model="user.username" />
              </UFormGroup>
              <UFormGroup label="Email" name="name">
                <UInput v-model="user.email" />
              </UFormGroup>
            </form>
            <div class="flex gap-2 justify-end mt-4">
              <UButton variant="soft" @click="open = false"> Cancel</UButton>
              <UButton>Save</UButton>
            </div>
          </div>
        </UCard>
      </UModal>
    </div>
    <div class="flex-1" v-else>
      <UButton color="white" variant="soft" size="sm" class="flex-1 text-left font-semibold" @click="authModal = true">
        <span class="whitespace-nowrap"> Sign in </span>
      </UButton>
      <UModal v-model="authModal">
        <UCard>
          <div class="flex flex-col gap-3">
            <div class="flex flex-col justify-center items-center gap-1">
              <UAvatar size="3xl" icon="i-heroicons-user-circle" />
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Welcome</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Please sign in or sign up to continue.</p>
            </div>
            <UTabs :items="items" class="mt-4">
              <template #login>
                <form class="flex flex-col gap-3">
                  <UFormGroup label="Username" name="username">
                    <UInput v-model="login.username" />
                  </UFormGroup>
                  <UFormGroup label="Password" name="password">
                    <UInput v-model="login.password" />
                  </UFormGroup>
                </form>
              </template>
              <template #signup>
                <form class="flex flex-col gap-3">
                  <UFormGroup label="Username" name="username">
                    <UInput v-model="signup.username" />
                  </UFormGroup>
                  <UFormGroup label="Email" name="email">
                    <UInput v-model="signup.email" />
                  </UFormGroup>
                  <UFormGroup label="Password" name="password">
                    <UInput v-model="signup.password" />
                  </UFormGroup>
                </form>
              </template>
            </UTabs>
            <div class="flex gap-2 justify-end mt-4">
              <UButton variant="soft" @click="authModal = false"> Cancel</UButton>
              <UButton>Save</UButton>
            </div>
          </div>
        </UCard>
      </UModal>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
