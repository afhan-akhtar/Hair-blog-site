import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromRequest, SESSION_COOKIE, isAdministrator } from "@/lib/auth";

const PUBLIC_API = ["/api/auth/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_API.some((p) => pathname === p)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/login")) {
    const session = await getSessionFromRequest(request);
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  const isProtected =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/posts") ||
    pathname.startsWith("/api/media") ||
    pathname.startsWith("/api/settings") ||
    pathname.startsWith("/api/users") ||
    pathname === "/api/auth/password";

  if (!isProtected) return NextResponse.next();

  const session = await getSessionFromRequest(request);

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!isAdministrator(session.role) && pathname.startsWith("/admin/users")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (!isAdministrator(session.role) && pathname.startsWith("/admin/menus")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const response = NextResponse.next();
  response.headers.set("x-user-role", session.role);
  response.headers.set("x-user-id", session.id);
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/posts/:path*", "/api/media/:path*", "/api/settings", "/api/users/:path*", "/api/auth/password"],
};
