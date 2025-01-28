import { NextRequest } from "next/server";
import { localizationMiddleware } from "./features/localization/localizationMiddleware";

export const config = { matcher: ["/((?!api|_next|.*.svg$).*)"] };

export function middleware(request: NextRequest) {
  return localizationMiddleware(request);
}
