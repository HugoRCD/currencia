import type { Article } from "~/types/Article";

export const usePublicArticle = () => {
  return useState<Article[]>("articles", () => []);
};

export function useArticle() {
  const toast = useToast();
  const publicArticles = usePublicArticle();

  const getLoading = ref(false);
  const loading = ref(false);
  const deleteLoading = ref(false);

  const articles = ref<Article[]>([]);

  async function fetchPublicArticles() {
    const { data } = await useFetch<Article[]>("/api/article");
    if (data.value) publicArticles.value = data.value;
  }

  async function fetchArticles() {
    getLoading.value = true;
    const { data, error } = await useFetch<Article[]>("/api/admin/article/article");
    if (error.value || !data.value)
      toast.add({
        title: "Whoops! Something went wrong.",
        icon: "i-heroicons-x-circle",
        color: "red",
        timeout: 2000,
      });
    if (data.value) articles.value = data.value;
    getLoading.value = false;
  }

  return {
    fetchPublicArticles,
    fetchArticles,
    getLoading,
    loading,
    deleteLoading,
    articles,
  };
}
