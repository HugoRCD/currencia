import { Role } from "~/types/User";

export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore();
  if (!userStore.isAdmin) return "/app/dashboard";
});
