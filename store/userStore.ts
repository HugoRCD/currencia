import { type publicUser, Role } from "~/types/User";
import { defineStore } from "pinia";

interface UserState {
  accessToken: string;
  user: publicUser | null;
}

const defaultUserState: UserState = {
  accessToken: "",
  user: null,
};

export const useUserStore = defineStore("user", {
  state: (): UserState => {
    return {
      accessToken: "",
      user: null,
    };
  },
  getters: {
    isAdmin(): boolean {
      if (this.user) {
        return this.user.role === Role.Admin;
      } else {
        return false;
      }
    },
    getAccessToken(): string {
      return this.accessToken;
    },
    getUser(): publicUser | null {
      return this.user;
    },
  },
  actions: {
    setUser(user: publicUser) {
      this.user = user;
    },
    logout() {
      this.$state = defaultUserState;
    },
  },
});
