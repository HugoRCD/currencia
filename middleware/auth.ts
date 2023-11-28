export default defineNuxtRouteMiddleware(async () => {
  const user = useUserStore().getUser;
  if (!user) return "/login";
});
