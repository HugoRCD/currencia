<script setup lang="ts">
const open = ref(false);
const commandPaletteRef = ref();

defineProps({
  sidebarOpen: {
    type: Boolean,
    default: false,
  },
  mobileMode: {
    type: Boolean,
    default: false,
  },
});

const actions = [
  {
    id: "back_to_home",
    label: "Back to home",
    icon: "i-heroicons-home",
    click: () => {
      useRouter().push("/");
      open.value = false;
    },
  },
];

const cryptos = usePublicCrypto();

const groups = computed(() =>
  [
    {
      key: "cryptos",
      commands: cryptos.value.map((crypto) => ({
        id: crypto.symbol,
        label: crypto.name,
        avatar: {
          src: crypto.logo,
          loading: "lazy",
        },
        click: () => {
          useRouter().push(`/app/crypto/${crypto.symbol}`);
          open.value = false;
        },
      })),
    },
    {
      key: "actions",
      commands: actions,
    },
  ].filter(Boolean),
);

function onSelect(option) {
  if (option.click) {
    option.click();
  } else if (option.to) {
    useRouter().push(option.to);
  }
}

defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      open.value = true;
    },
  },
});

defineShortcuts({
  escape: {
    usingInput: true,
    handler: () => {
      open.value = false;
    },
  },
});
</script>

<template>
  <div class="sm:w-full">
    <UButton block size="lg" class="console-button whitespace-nowrap justify-start" @click="open = !open" v-if="!mobileMode">
      <UIcon name="i-heroicons-magnifying-glass" class="h-5 w-5" />
      <span class="text-sm font-medium hidden sm:block" v-if="sidebarOpen">Find a crypto</span>
    </UButton>
    <UButton
      :ui="{ rounded: 'rounded-xl' }"
      size="xl"
      icon="i-heroicons-magnifying-glass"
      class="whitespace-nowrap justify-center"
      color="black"
      @click="open = !open"
      v-else
    />
    <UModal v-model="open" :ui="{ container: 'flex min-h-full items-start sm:items-center justify-center text-center' }">
      <UCommandPalette
        placeholder="Search for a crypto..."
        icon="i-heroicons-magnifying-glass"
        ref="commandPaletteRef"
        :groups="groups"
        :autoselect="false"
        @update:model-value="onSelect"
      >
      </UCommandPalette>
    </UModal>
  </div>
</template>

<style scoped lang="scss">
.console-button {
  @apply cursor-pointer rounded-lg px-3 py-2 flex flex-row items-center gap-2;
  @apply bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-gray-200;
  @apply text-white dark:text-neutral-900 hover:text-white dark:hover:text-gray-900;
}
</style>
