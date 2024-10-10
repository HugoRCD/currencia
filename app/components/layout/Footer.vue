<template>
  <div class="my-6">
    <Divider />
    <footer class="mx-auto max-w-7xl px-4 py-6 flex flex-col sm:flex-row justify-around items-center gap-4">
      <div class="flex items-center gap-4">
        <span class="text-sm text-center dark:text-neutral-600 text-neutral-900"
          >© 2023,
          <NuxtLink
            role="link"
            target="_blank"
            to="https://hrcd.me/"
            class="transition-colors duration-300 ease-in-out hover:text-primary"
            aria-label="Go to HRCD Hugo Richard portfolio website"
          >
            HugoRCD
          </NuxtLink>
          All rights reserved.
        </span>
      </div>
      <div class="flex justify-center items-center gap-4 mt-2">
        <ThemeSelector />
        <!--        <ThemeToggle />-->
      </div>
    </footer>
  </div>
</template>
<script setup lang="ts"></script>
