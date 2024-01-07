<script setup lang="ts">
import { googleSdkLoaded } from "vue3-google-login";
import { useCurrentUser } from "~/composables/useUser";

const login = () => {
  const SCOPES = "profile";
  googleSdkLoaded((google) => {
    google.accounts.oauth2
      .initTokenClient({
        client_id: useRuntimeConfig().public.googleClientId,
        scope: SCOPES,
        callback: async (response) => {
          const user = await $fetch("/api/auth/google", {
            method: "POST",
            body: {
              access_token: response.access_token,
            },
          });
          if (user) {
            useCurrentUser().value = user;
            useCrypto().fetchPublicCryptos();
          }
        },
      })
      .requestAccessToken();
  });
};
</script>

<template>
  <UButton color="black" label="Login with Google" block @click="login" />
</template>
