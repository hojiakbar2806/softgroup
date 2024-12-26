import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["uz", "en", "ru"],
  defaultLocale: "uz",
});

export type Locale = (typeof routing.locales)[number]; 
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);