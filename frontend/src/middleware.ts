import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

export default async function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken");
  const { pathname } = req.nextUrl;

  const languageRegex = /^(\/(uz|en|ru))\/profile/;

  if (!refreshToken && languageRegex.test(pathname)) {
    const language = pathname.split("/")[1];
    return NextResponse.redirect(new URL(`/${language}/login?next=${pathname}`, req.url));
  }

  const intlMiddleware = createMiddleware(routing);
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/", "/(uz|en|ru)/:path*"],
};
