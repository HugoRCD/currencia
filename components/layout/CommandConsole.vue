<script setup>
const open = ref(false);
const commandPaletteRef = ref();

defineProps({
  sidebarOpen: {
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
    shortcuts: ["⌘", "Z"],
  },
];

import { cryptos } from "~/data/crypto";

const cryptosOptions = cryptos.map((crypto) => ({
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
}));

const groups = computed(() =>
  [
    {
      key: "cryptos",
      commands: cryptosOptions,
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
  } else if (option.href) {
    window.open(option.href, "_blank");
  }
}

onMounted(() => {
  if (process.client) {
    document.addEventListener("keydown", (event) => {
      if (event.metaKey && event.key === "k") open.value = !open.value;
    });
    document.addEventListener("keydown", (event) => {
      if (event.metaKey && event.key === "z") {
        event.preventDefault();
        actions.find((action) => action.id === "back_to_home").click();
      }

      if (event.metaKey && event.key === "f") {
        event.preventDefault();
        actions.find((action) => action.id === "switch_french").click();
      }

      if (event.metaKey && event.key === "e") {
        event.preventDefault();
        actions.find((action) => action.id === "switch_english").click();
      }
    });
  }
});
</script>

<template>
  <div class="w-full">
    <UButton block size="lg" class="console-button whitespace-nowrap" @click="open = !open">
      <UIcon name="i-heroicons-command-line" class="h-5 w-5" />
      <span class="text-sm font-medium hidden sm:block" v-if="sidebarOpen">Find a crypto</span>
    </UButton>
    <UModal v-model="open" :ui="{ container: 'flex min-h-full items-start sm:items-center justify-center text-center' }">
      <UCommandPalette
        placeholder="Search for a crypto..."
        icon="i-heroicons-command-line"
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

/*.dark .console-button {
  box-shadow: inset 0px -2px 0px 3px #b5b3b3, 0 -3px 0 #c8c7c7 inset;
  &:active {
    box-shadow: none;
  }
}

.light .console-button {
  box-shadow: inset 0px -2px 0px 3px #414141, 0 -3px 0 #6a6a6a inset;
  &:active {
    box-shadow: none;
  }
}*/
</style>
