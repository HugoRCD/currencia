import {
  HomeIcon, EnvelopeIcon
} from "@heroicons/vue/24/outline";
import type { FunctionalComponent } from "@vue/runtime-core";

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
    default:
      return [];
  }
}