import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { type NextRequest, NextResponse } from "next/server";
import { i18n, Locale } from "./i18n.config";

function getLocale(request: NextRequest): string {
  const cookieLang = request.cookies.get("NEXT_LANG")?.value as Locale;

  if (cookieLang && i18n.locales.includes(cookieLang)) {
    return cookieLang;
  }

  const headers = {
    "accept-language": request.headers.get("accept-language") ?? "",
  };
  const languages = new Negotiator({ headers }).languages();
  return match(languages, i18n.locales, i18n.defaultLocale);
}

export function localizationMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    i18n.locales.some(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )
  ) {
    return NextResponse.next();
  }

  const ignoredPaths = ["_next", "api", "images"];
  const isIgnored = ignoredPaths.some((path) =>
    pathname.startsWith(`/${path}`)
  );
  if (isIgnored) {
    return NextResponse.next();
  }

  const locale = getLocale(request);
  const response = NextResponse.redirect(
    new URL(`/${locale}${pathname}`, request.url)
  );

  response.cookies.set("NEXT_LANG", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
