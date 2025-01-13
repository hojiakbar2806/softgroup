import { Locale } from "@/i18n/routing";

type Messages = {
  [K in Locale]: () => Promise<any>; // Messages tipini aniqroq ko'rsatish mumkin
};

export const messages: Messages = {
  uz: () => import("./uz.json").then((m) => m.default),
  en: () => import("./en.json").then((m) => m.default),
  ru: () => import("./ru.json").then((m) => m.default),
};
