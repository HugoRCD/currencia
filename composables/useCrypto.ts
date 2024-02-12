import type { UpsertCryptoDto, Crypto } from "~/types/Crypto";

export const usePublicCrypto = () => {
  return useState<Crypto[]>("cryptos", () => []);
};

export function useCrypto() {
  const toast = useToast();
  const publicCryptos = usePublicCrypto();
  const user = useCurrentUser();

  const getLoading = ref(false);
  const loading = ref(false);
  const deleteLoading = ref(false);

  const cryptos = ref<Crypto[]>([]);

  async function fetchPublicCryptos() {
    const data = await $fetch("/api/crypto");
    if (data) publicCryptos.value = user.value ? data : data.slice(0, 6);
  }

  async function fetchCryptos() {
    getLoading.value = true;
    const { data, error } = await useFetch("/api/admin/crypto/crypto");
    if (error.value || !data.value)
      toast.add({
        title: "Whoops! Something went wrong.",
        icon: "i-heroicons-x-circle",
        color: "red",
        timeout: 2000,
      });
    if (data.value) cryptos.value = data.value;
    getLoading.value = false;
  }

  async function upsertCrypto(upsertCryptoDto: UpsertCryptoDto) {
    loading.value = true;
    const { data, error } = await useFetch("/api/admin/crypto/crypto", {
      method: "POST",
      body: upsertCryptoDto,
    });
    if (error.value || !data.value)
      toast.add({
        title: "Whoops! Something went wrong.",
        icon: "i-heroicons-x-circle",
        color: "red",
        timeout: 2000,
      });
    toast.add({
      title: "Crypto created successfully.",
      icon: "i-heroicons-check-circle",
      timeout: 2000,
    });
    loading.value = false;
    await fetchCryptos();
    await fetchPublicCryptos();
  }

  async function deleteCrypto(id: number) {
    deleteLoading.value = true;
    const { data, error } = await useFetch(`/api/admin/crypto/${id}`, {
      method: "DELETE",
    });
    if (error.value || !data.value)
      toast.add({
        title: "Whoops! Something went wrong.",
        icon: "i-heroicons-x-circle",
        color: "red",
        timeout: 2000,
      });
    toast.add({
      title: "Crypto deleted successfully.",
      icon: "i-heroicons-check-circle",
      timeout: 2000,
    });
    deleteLoading.value = false;
    await fetchCryptos();
    await fetchPublicCryptos();
  }

  return {
    getLoading,
    loading,
    deleteLoading,
    cryptos,
    fetchCryptos,
    upsertCrypto,
    deleteCrypto,
    fetchPublicCryptos,
  };
}
