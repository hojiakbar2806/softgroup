import { getRequestConfig } from "next-intl/server";
import { Locale, routing } from "./routing";
import { messages } from "@/messages/messages";

export default getRequestConfig(async ({ locale: requestLocale }) => {
  let locale = requestLocale as Locale;

  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: await messages[locale](),
    timeZone: "UTC",
  };
});
