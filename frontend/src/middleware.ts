import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

export default async function middleware(request: NextRequest) {
  const intlMiddleware = createMiddleware(routing);
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(uz|en|ru)/:path*"],
};
