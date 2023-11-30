import { HomeIcon, EnvelopeIcon, UserIcon, UsersIcon, CogIcon, ChatBubbleLeftIcon, ChartBarSquareIcon } from "@heroicons/vue/24/outline";
import type { FunctionalComponent } from "vue";

type Where = "home" | "app" | "user" | "admin";

export type Navigation = {
  name: string;
  title: string;
  description: string;
  to: string;
  icon: FunctionalComponent;
};

export function getNavigation(where: Where): Navigation[] {
  switch (where) {
    case "home":
      return [
        { name: "Home", to: "/", icon: HomeIcon, title: "Home", description: "" },
        { name: "Contact", to: "/contact", icon: EnvelopeIcon, title: "Contact", description: "" },
      ];
    case "app":
      return [
        {
          name: "Dashboard",
          to: "/app/dashboard",
          icon: HomeIcon,
          title: "Market overview",
          description: "You can see all the market information, latest news, and more.",
        },
        {
          name: "Articles",
          to: "/app/articles",
          icon: ChatBubbleLeftIcon,
          title: "Latest Crypto News",
          description: "Where the community shares the latest news about the crypto world.",
        },
        {
          name: "Leaderboard",
          to: "/app/leaderboard",
          icon: ChartBarSquareIcon,
          title: "Leaderboard",
          description: "Check out the top current crypto.",
        },
      ];
    case "user":
      return [
        { name: "Profile", to: "/app/profile", icon: UserIcon, title: "Profile", description: "Here you can see your profile information and edit it." },
        {
          name: "Settings",
          to: "/app/settings",
          icon: CogIcon,
          title: "Settings",
          description: "You can change your settings here, change which coins you want to see, and more.",
        },
      ];
    case "admin":
      return [
        { name: "Users", to: "/app/admin/users", icon: UsersIcon, title: "Users", description: "Users page" },
        { name: "App Settings", to: "/app/admin/settings", icon: CogIcon, title: "App Settings", description: "App Settings page" },
      ];
    default:
      return [];
  }
}
