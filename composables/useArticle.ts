import type { Article } from "~/types/Article";
import type { Feed } from "~/types/Feed";

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
  const feeds = ref<Feed[]>([]);

  async function fetchDailyArticles() {
    await useFetch("/api/feed");
  }

  async function fetchFeed() {
    const { data, error } = await useFetch<Feed[]>("/api/admin/feed");
    if (error.value || !data.value)
      toast.add({
        title: "Whoops! Something went wrong.",
        icon: "i-heroicons-x-circle",
        color: "red",
        timeout: 2000,
      });
    if (data.value) feeds.value = data.value;
  }

  async function fetchPublicArticles() {
    const { data } = await useFetch<Article[]>("/api/article");
    if (data.value) publicArticles.value = data.value;
  }

  async function fetchArticles(load: boolean = true) {
    if (load) getLoading.value = true;
    const { data, error } = await useFetch<Article[]>("/api/admin/article/article");
    if (error.value || !data.value)
      toast.add({
        title: "Whoops! Something went wrong.",
        icon: "i-heroicons-x-circle",
        color: "red",
        timeout: 2000,
      });
    if (data.value) articles.value = data.value;
    if (load) getLoading.value = false;
  }

  async function insertRssFeed(url: string) {
    const { data, error } = await useFetch<Article[]>("/api/admin/feed", {
      method: "POST",
      body: { url },
    });
    if (error.value || !data.value)
      toast.add({
        title: "Whoops! Something went wrong.",
        icon: "i-heroicons-x-circle",
        color: "red",
        timeout: 2000,
      });
    else {
      toast.add({
        title: "Feed updated successfully.",
        icon: "i-heroicons-check-circle",
        timeout: 2000,
      });
    }
  }

  async function updateArticle(id: number, visible: boolean) {
    const { data, error } = await useFetch<Article[]>(`/api/admin/article/${id}`, {
      method: "PUT",
      body: { visible },
    });
    if (error.value || !data.value)
      toast.add({
        title: "Whoops! Something went wrong.",
        icon: "i-heroicons-x-circle",
        color: "red",
        timeout: 2000,
      });
    else {
      toast.add({
        title: "Article updated successfully.",
        icon: "i-heroicons-check-circle",
        timeout: 2000,
      });
    }
    if (data.value) {
      await fetchArticles(false);
      await fetchPublicArticles();
    }
  }

  return {
    fetchPublicArticles,
    fetchArticles,
    fetchFeed,
    updateArticle,
    insertRssFeed,
    getLoading,
    loading,
    deleteLoading,
    articles,
    feeds,
    fetchDailyArticles,
  };
}
