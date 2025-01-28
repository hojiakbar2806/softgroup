import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Locale } from "@/features/localization/i18n.config";

export function useLocale() {
  const pathName = usePathname();
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState<Locale>(() => {
    if (!pathName) return "uz";
    const segments = pathName.split("/");
    return segments[1] as Locale;
  });

  const setLang = (locale: Locale) => {
    if (!pathName) return;
    const segments = pathName.split("/");
    segments[1] = locale;
    const newPath = segments.join("/");
    setCurrentLang(locale);
    document.cookie = `NEXT_LANG=${locale};path=/`;
    router.push(newPath);
  };

  return { currentLang, setLang };
}
