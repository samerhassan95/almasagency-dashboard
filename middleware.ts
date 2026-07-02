import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "almasa_admin_auth";

function isAdminRoute(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function parseSession(value: string) {
  try {
    const payload = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    if ((!payload?.username && !payload?.email) || typeof payload.exp !== "number") {
      return null;
    }

    return payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const sessionValue = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = sessionValue ? parseSession(sessionValue) : null;

  if (pathname === "/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!isAdminRoute(pathname)) {
    return NextResponse.next();
  }

  if (!session) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/api/auth/:path*"],
};
