export default defineNuxtRouteMiddleware(async () => {
  await useUser();
  const user = useUserStore().getUser;
  if (!user) return "/login";
});
