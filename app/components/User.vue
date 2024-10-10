<script setup lang="ts">
import { useSignup, useLogin, useLogout, updateUser, useCurrentUser } from "~/composables/useUser";
import type { CreateUserDto, LoginUserDto } from "~/types/User";

defineProps({
  sideBarOpen: {
    type: Boolean,
    default: true,
  },
});

const loading = ref(false);
const authModal = ref(false);

const user = useCurrentUser();

const login = ref({
  username: "RickAstley",
  password: "john",
});

const signup = ref({
  username: "",
  email: "",
  password: "",
});

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

async function signin(loginUserDto: LoginUserDto) {
  loading.value = true;
  await useLogin(loginUserDto);
  login.value = {
    username: "",
    password: "",
  };
  authModal.value = false;
  loading.value = false;
}

async function createAccount(signupUserDto: CreateUserDto) {
  loading.value = true;
  await useSignup(signupUserDto);
  signup.value = {
    username: "",
    email: "",
    password: "",
  };
  loading.value = false;
  authModal.value = false;
}

async function logout() {
  await useLogout();
  authModal.value = false;
}

async function updateCurrentUser() {
  if (!user.value) return;
  loading.value = true;
  await updateUser(user.value.id, user.value);
  loading.value = false;
  open.value = false;
}
</script>

<template>
  <div class="w-full flex items-center gap-2" :class="sideBarOpen ? 'justify-center sm:justify-between' : 'justify-center'">
    <div v-if="user">
      <UButton color="white" variant="soft" size="sm" class="text-left font-semibold" @click="open = true" :ui="{ padding: { sm: 'px-0' } }">
        <UAvatar size="sm" :src="user.avatar" imgClass="object-cover" />
        <span class="whitespace-nowrap" :class="sideBarOpen ? 'hidden sm:flex' : 'hidden'">
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
              <div class="flex gap-2 justify-between pt-4">
                <UButton variant="soft" color="red" @click="logout">Logout</UButton>
                <div class="flex gap-2">
                  <UButton variant="soft" @click="open = false">Cancel</UButton>
                  <UButton :loading="loading" type="submit">Save</UButton>
                </div>
              </div>
            </form>
          </div>
        </UCard>
      </UModal>
    </div>
    <div v-else>
      <UButton color="white" variant="soft" size="sm" class="text-left font-semibold" @click="authModal = true" :ui="{ padding: { sm: 'px-0' } }">
        <UAvatar icon="i-heroicons-user-circle" size="sm" :ui="{ icon: { size: { sm: 'w-5 h-5' } } }" />
        <span class="whitespace-nowrap" :class="sideBarOpen ? 'hidden sm:flex' : 'hidden'">Sign / Signup</span>
      </UButton>
      <UModal v-model="authModal">
        <UCard>
          <div class="flex flex-col gap-3">
            <div class="flex flex-col justify-center items-center gap-1">
              <UAvatar size="3xl" icon="i-heroicons-user-circle" />
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Welcome</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Please sign in or sign up to continue.</p>
            </div>
            <div class="flex justify-center mt-2">
              <SignWithGoogle />
            </div>
            <UDivider label="OR" class="my-2" />
            <UTabs :items="items">
              <template #login>
                <form class="flex flex-col gap-3" @submit.prevent="signin(login)">
                  <UFormGroup label="Username" name="username">
                    <UInput v-model="login.username" type="username" />
                  </UFormGroup>
                  <UFormGroup label="Password" name="password">
                    <UInput v-model="login.password" type="password" />
                  </UFormGroup>
                  <div class="flex gap-2 justify-end mt-4">
                    <UButton variant="soft" @click="authModal = false">Cancel</UButton>
                    <UButton :loading="loading" type="submit">Save</UButton>
                  </div>
                </form>
              </template>
              <template #signup>
                <form class="flex flex-col gap-3" @submit.prevent="createAccount(signup)">
                  <UFormGroup label="Username" name="username">
                    <UInput v-model="signup.username" type="username" />
                  </UFormGroup>
                  <UFormGroup label="Email" name="email">
                    <UInput v-model="signup.email" type="email" />
                  </UFormGroup>
                  <UFormGroup label="Password" name="password">
                    <UInput v-model="signup.password" type="password" />
                  </UFormGroup>
                  <div class="flex gap-2 justify-end mt-4">
                    <UButton variant="soft" @click="authModal = false">Cancel</UButton>
                    <UButton :loading="loading" type="submit">Save</UButton>
                  </div>
                </form>
              </template>
            </UTabs>
          </div>
        </UCard>
      </UModal>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
