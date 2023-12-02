import type { CreateUserDto, LoginUserDto, publicUser, UpdateUserDto, User } from "~/types/User";
import { Role } from "~/types/User";

export const useCurrentUser = () => {
  return useState<publicUser | null>("user", () => null);
};

export const isLoggedIn = computed(() => {
  return !!useCurrentUser().value;
});

export const isAdmin = computed(() => {
  return useCurrentUser().value?.role === Role.Admin;
});

export async function useSignup(createUserInput: CreateUserDto) {
  const toast = useToast();
  const { error, data } = await useFetch("/api/auth/signup", {
    method: "POST",
    body: createUserInput,
  });
  if (error.value || !data.value) {
    toast.add({
      title: "Whoops! Something went wrong.",
      icon: "i-heroicons-x-circle",
      color: "red",
      timeout: 2000,
    });
    return;
  }
  toast.add({
    title: "Signup successful!",
    icon: "i-heroicons-check-circle",
    timeout: 2000,
  });
}

export async function useLogin(loginInput: LoginUserDto) {
  const toast = useToast();
  const { error, data } = await useFetch<publicUser>("/api/auth/login", {
    method: "POST",
    body: loginInput,
  });
  if (data.value) {
    useCurrentUser().value = data.value;
    toast.add({
      title: "Hello, " + data.value.username,
      icon: "i-heroicons-check-circle",
      timeout: 2000,
    });
  }
  if (error.value || !data.value) {
    toast.add({
      title: "Whoops! Something went wrong.",
      icon: "i-heroicons-x-circle",
      color: "red",
      timeout: 2000,
    });
  }
}

export async function useLogout() {
  const toast = useToast();
  useCurrentUser().value = null;
  const { error } = await useFetch("/api/auth/logout", {
    method: "POST",
  });
  if (error.value) {
    toast.add({
      title: "Whoops! Something went wrong.",
      icon: "i-heroicons-x-circle",
      color: "red",
      timeout: 2000,
    });
    return;
  }
  toast.add({
    title: "Logout successful!",
    icon: "i-heroicons-check-circle",
    timeout: 2000,
  });
}

export async function useUser(): Promise<publicUser | null> {
  const authCookie = useCookie("authToken");
  const user = useCurrentUser().value;

  if (authCookie && !user) {
    const cookieHeaders = useRequestHeaders(["cookie"]);
    const { data } = await useFetch<User>("/api/auth/currentUser", {
      method: "GET",
      headers: cookieHeaders as HeadersInit,
    });
    if (!data.value) {
      return null;
    }
    useCurrentUser().value = data.value;
  }
  return user;
}

export async function updateUser(id: number, updateUserInput: UpdateUserDto) {
  const toast = useToast();
  const { error, data } = await useFetch<User>(`/api/user/${id}`, {
    method: "PUT",
    body: updateUserInput,
  });
  if (error.value || !data.value) {
    toast.add({
      title: "Whoops! Something went wrong.",
      icon: "i-heroicons-x-circle",
      color: "red",
      timeout: 2000,
    });
    return;
  }
  useCurrentUser().value = data.value;
  toast.add({
    title: "User updated!",
    icon: "i-heroicons-check-circle",
    timeout: 2000,
  });
}
