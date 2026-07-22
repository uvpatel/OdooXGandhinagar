import { NextResponse, type NextRequest } from "next/server";

const publicRoutes = new Set(["/login", "/signup"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = request.cookies.get("better-auth.session_token") || request.cookies.get("__Secure-better-auth.session_token");

  if (!publicRoutes.has(pathname) && !hasSessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/assets/:path*", "/allocations/:path*", "/bookings/:path*", "/maintenance/:path*", "/audits/:path*", "/organization/:path*", "/reports/:path*", "/notifications/:path*", "/login", "/signup"] };
