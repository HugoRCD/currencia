<script setup lang="ts">
const isOpen = ref(false);

import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const options = [
  { label: "Request new crypto", value: "crypto" },
  { label: "Report a bug", value: "bug" },
  { label: "Request a new features", value: "feature" },
  { label: "Request a new features", value: "feature" },
];

const state = reactive({
  input: undefined,
  textarea: undefined,
  select: undefined,
  selectMenu: undefined,
  checkbox: undefined,
  toggle: undefined,
  radio: undefined,
  radioGroup: undefined,
  switch: undefined,
  range: undefined,
});

const schema = z.object({
  input: z.string().min(10),
  textarea: z.string().min(10),
  select: z.string().refine((value) => value === "option-2", {
    message: "Select Option 2",
  }),
  selectMenu: z.any().refine((option) => option?.value === "option-2", {
    message: "Select Option 2",
  }),
  range: z.number().max(20, { message: "Must be less than 20" }),
});

type Schema = z.infer<typeof schema>;

const form = ref();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data);
}
</script>

<template>
  <div>
    <UButton :ui="{ rounded: 'rounded-full' }" @click="isOpen = !isOpen" icon="i-heroicons-chat-bubble-oval-left-ellipsis" size="xl" />
    <UModal v-model="isOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Help Center</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
          </div>
          <p class="text-gray-500 dark:text-gray-400 text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.</p>
        </template>

        <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormGroup name="name" label="Name">
            <UInput v-model="state.input" />
          </UFormGroup>

          <UFormGroup name="Request Type" label="Request Type">
            <USelect v-model="state.select" placeholder="Select..." :options="options" />
          </UFormGroup>

          <UFormGroup name="Description" label="Description">
            <UTextarea v-model="state.textarea" />
          </UFormGroup>

          <div class="w-full flex gap-2 mt-20">
            <UButton type="submit" class="flex-1 text-center"> Submit </UButton>
            <UButton variant="outline" class="flex-1 text-center" @click="form.clear()"> Clear </UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<style scoped lang="scss"></style>
