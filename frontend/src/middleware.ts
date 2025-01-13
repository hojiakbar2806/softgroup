import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

export default async function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware({
    ...routing,
    defaultLocale: "uz",
    localePrefix: "as-needed",
  });

  return handleI18nRouting(request);
}
export const config = {
  matcher: ["/", "/(uz|en|ru)/:path*"],
};
