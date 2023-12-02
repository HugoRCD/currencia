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
          name: "Market overview",
          to: "/app/market",
          icon: ChartBarSquareIcon,
          title: "Market overview",
          description: "You can see all the market information, latest news, and more.",
        },
        {
          name: "News",
          to: "/app/news",
          icon: NewspaperIcon,
          title: "Latest Crypto News",
          description: "Where the community shares the latest news about the crypto world.",
        },
        {
          name: "Leaderboard",
          to: "/app/leaderboard",
          icon: StarIcon,
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
        {
          name: "Logout",
          to: "/",
          icon: ArrowLeftOnRectangleIcon,
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
