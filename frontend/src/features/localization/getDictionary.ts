import "server-only";

import type { Locale } from "./i18n.config";
import { cookies } from "next/headers";

const dictionaries = {
  en: async () => {
    const dictModule = await import("./dictionary/en.json"); // module -> dictModule
    return dictModule.default;
  },
  uz: async () => {
    const dictModule = await import("./dictionary/uz.json");
    return dictModule.default;
  },
  ru: async () => {
    const dictModule = await import("./dictionary/ru.json");
    return dictModule.default;
  },
};

export const getDictionary = async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LANG")?.value as Locale;
  return (await dictionaries[locale]?.()) ?? dictionaries["uz"]();
};
