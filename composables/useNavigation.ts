import {
  HomeIcon,
  EnvelopeIcon,
  UserIcon,
  UsersIcon,
  CogIcon,
  ChartBarSquareIcon,
  StarIcon,
  ArrowLeftOnRectangleIcon,
  NewspaperIcon,
  CurrencyDollarIcon,
} from "@heroicons/vue/24/outline";
import type { FunctionalComponent } from "vue";

type Where = "home" | "app" | "user" | "admin";

export type Navigation = {
  name: string;
  title: string;
  description: string;
  to: string;
  icon: FunctionalComponent;
  iconString: string;
};

export function getNavigation(where: Where): Navigation[] {
  switch (where) {
    case "home":
      return [
        { name: "Home", to: "/", icon: HomeIcon, iconString: "i-heroicons-home", title: "Home", description: "" },
        { name: "Contact", to: "/contact", icon: EnvelopeIcon, iconString: "i-heroicons-envelope", title: "Contact", description: "" },
      ];
    case "app":
      return [
        {
          name: "Market overview",
          to: "/app/market",
          icon: ChartBarSquareIcon,
          iconString: "i-heroicons-chart-bar-square",
          title: "Market overview",
          description: "You can see all the market information, latest news, and more.",
        },
        {
          name: "News",
          to: "/app/news",
          icon: NewspaperIcon,
          iconString: "i-heroicons-newspaper",
          title: "Latest Crypto News",
          description: "Where the community shares the latest news about the crypto world.",
        },
        {
          name: "Leaderboard",
          to: "/app/leaderboard",
          icon: StarIcon,
          iconString: "i-heroicons-star",
          title: "Leaderboard",
          description: "Check out the top current crypto.",
        },
      ];
    case "user":
      return [
        {
          name: "Profile",
          to: "/app/profile",
          icon: UserIcon,
          iconString: "i-heroicons-user",
          title: "Profile",
          description: "Here you can see your profile information and edit it.",
        },
        {
          name: "Settings",
          to: "/app/settings",
          icon: CogIcon,
          iconString: "i-heroicons-cog",
          title: "Settings",
          description: "You can change your settings here, change which coins you want to see, and more.",
        },
        {
          name: "Logout",
          to: "/",
          icon: ArrowLeftOnRectangleIcon,
          iconString: "i-heroicons-arrow-left-on-rectangle",
          title: "Logout",
          description: "Logout",
        },
      ];
    case "admin":
      return [
        { name: "Users", to: "/app/admin/users", icon: UsersIcon, title: "Users", description: "Users page" },
        { name: "Cryptos", to: "/app/admin/cryptos", icon: CurrencyDollarIcon, title: "Cryptos", description: "Cryptos page" },
      ];
    default:
      return [];
  }
}
