import type { CreateUserDto, LoginUserDto, publicUser, User } from "~/types/User";

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
    });
    return;
  }
  toast.add({
    title: "Signup successful!",
    icon: "i-heroicons-check-circle",
  });
}

export async function useLogin(loginInput: LoginUserDto) {
  const toast = useToast();
  const { error, data } = await useFetch<publicUser>("/api/auth/login", {
    method: "POST",
    body: loginInput,
  });
  if (data.value) {
    useUserStore().setUser(data.value);
    toast.add({
      title: "Login successful!",
      icon: "i-heroicons-check-circle",
    });
  }
  if (error.value || !data.value) {
    toast.add({
      title: "Whoops! Something went wrong.",
      icon: "i-heroicons-x-circle",
      color: "red",
    });
  }
}

export async function useLogout() {
  const toast = useToast();
  const { error } = await useFetch("/api/auth/logout", {
    method: "POST",
  });
  if (error.value) {
    toast.add({
      title: "Whoops! Something went wrong.",
      icon: "i-heroicons-x-circle",
      color: "red",
    });
    return;
  }
  useUserStore().logout();
  toast.add({
    title: "Logout successful!",
    icon: "i-heroicons-check-circle",
  });
}

export async function useUser(): Promise<publicUser | null> {
  const authCookie = useCookie("authToken").value;
  const user = useUserStore().getUser;
  console.log("user", user);
  console.log("authCookie", authCookie);

  if (authCookie && !user) {
    const cookieHeaders = useRequestHeaders(["cookie"]);
    const { data } = await useFetch<User>("/api/auth/currentUser", {
      method: "GET",
      headers: cookieHeaders as HeadersInit,
    });
    console.log(data);
    if (!data.value) {
      return null;
    }
    useUserStore().setUser(data.value);
  }
  return user;
}
