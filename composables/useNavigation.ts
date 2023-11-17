import { HomeIcon, EnvelopeIcon, UserIcon, UsersIcon, CogIcon, ChatBubbleLeftIcon } from "@heroicons/vue/24/outline";
import type { FunctionalComponent } from "vue";

type Where = "home" | "app" | "user" | "admin";

type Navigation = {
  name: string;
  to: string;
  icon: FunctionalComponent;
};

export function getNavigation(where: Where): Navigation[] {
  switch (where) {
    case "home":
      return [
        { name: "Home", to: "/", icon: HomeIcon },
        { name: "Contact", to: "/contact", icon: EnvelopeIcon },
      ];
    case "app":
      return [
        { name: "Dashboard", to: "/app/dashboard", icon: HomeIcon },
        { name: "Articles", to: "/app/articles", icon: ChatBubbleLeftIcon },
        { name: "Profile", to: "/app/profile", icon: UserIcon },
        { name: "Settings", to: "/app/settings", icon: CogIcon },
      ];
    case "admin":
      return [
        { name: "Users", to: "/app/admin/users", icon: UsersIcon },
        { name: "App Settings", to: "/app/admin/settings", icon: CogIcon },
      ];
    default:
      return [];
  }
}
