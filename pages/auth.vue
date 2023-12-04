<script setup lang="ts">
import type { LoginUserDto } from "~/types/User";
import { useLogin } from "~/composables/useUser";

definePageMeta({
  layout: "auth",
});

const login = ref({
  username: "",
  password: "",
});
const loading = ref(false);

async function signin(loginUserDto: LoginUserDto) {
  loading.value = true;
  await useLogin(loginUserDto);
  navigateTo("/app/market");
  login.value = {
    username: "",
    password: "",
  };
  loading.value = false;
}
</script>

<template>
  <div class="flex flex-row justify-center items-center h-screen w-screen">
    <div class="relative flex flex-col justify-center items-center h-full w-full sm:w-1/2 px-3 sm:px-0">
      <div
        class="z-1 pointer-events-none absolute inset-0 bg-center bg-grid-black/30 dark:bg-grid-white/20 bg-grid-14 [mask-image:radial-gradient(white,transparent_70%)]"
      ></div>
      <div class="bg-white rounded-full w-52 h-52 absolute blur-[250px] -z-1"></div>
      <div class="relative flex flex-col gap-4 p-8 rounded-lg shadow-lg w-full sm:max-w-md bg-white/80 dark:bg-zinc-950/30 backdrop-blur-sm">
        <img src="/assets/currencia-logo.png" alt="logo" class="w-12 h-12 rounded-full absolute -top-6 left-1/2 transform -translate-x-1/2" />
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl font-semibold text-center">Welcome back</h1>
          <p class="text-sm text-center text-gray-500 dark:text-gray-400">Sign in to continue</p>
        </div>
        <form class="flex flex-col gap-3" @submit.prevent="signin(login)">
          <UFormGroup label="Username" name="username">
            <UInput v-model="login.username" type="username" />
          </UFormGroup>
          <UFormGroup label="Password" name="password">
            <UInput v-model="login.password" type="password" />
          </UFormGroup>
          <UButton :loading="loading" type="submit" class="mt-6">Save</UButton>
        </form>
        <div class="flex justify-center">
          <ThemeToggle />
        </div>
      </div>
    </div>
    <div class="flex-col justify-center items-center h-full sm:w-1/2 p-3 hidden sm:flex">
      <img
        src="https://academy-public.coinmarketcap.com/srd-optimized-uploads/9b207c452f2f469892569653b035cb86.png"
        alt="login-image"
        class="w-full h-full rounded-xl"
      />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
