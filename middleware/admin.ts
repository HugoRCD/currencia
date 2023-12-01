export default defineNuxtRouteMiddleware(async () => {
  await useUser();
  const userStore = useUserStore();
  if (!userStore.isAdmin) return "/app/dashboard";
});
