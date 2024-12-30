import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

export default async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const isLoggedIn = cookies.get("isLoggedIn");

  const pathname = nextUrl.pathname;

  const languageRegex = /^(\/(uz|en|ru))\/profile/;

  if (
    !isLoggedIn?.value ||
    (isLoggedIn?.value === "false" && languageRegex.test(pathname))
  ) {
    const language = pathname.split("/")[1];
    return NextResponse.redirect(
      new URL(`/${language}/login?next=${pathname}`, nextUrl.origin)
    );
  }

  const intlMiddleware = createMiddleware(routing);
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(uz|en|ru)/:path*"],
};
