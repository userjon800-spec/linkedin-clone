import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  let accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const isApiRoute = pathname.startsWith("/api");
  const isRefreshRoute = pathname.startsWith("/api/auth/refresh");
  const publicRoutes = [
    "/auth/signin",
    "/auth/signup",
    "/auth/forgot-password",
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const getValidPayload = (token?: string) => {
    if (!token) return null;
    try {
      const decoded = decodeJwt(token);
      if (decoded.exp && decoded.exp * 1000 > Date.now()) {
        return decoded;
      }
    } catch {
      return null;
    }
    return null;
  };

  let newSetCookieHeader: string | null = null;

  // ==========================================
  // 0. AUTO-REFRESH: accessToken yaroqsiz, refreshToken yaroqli bo'lsa
  // ==========================================
  if (
    !getValidPayload(accessToken) &&
    getValidPayload(refreshToken) &&
    !isRefreshRoute
  ) {
    try {
      const refreshRes = await fetch(new URL("/api/auth/refresh", req.url), {
        method: "POST",
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
      });

      if (refreshRes.ok) {
        // Yangi accessToken'ni Set-Cookie headerdan olamiz
        newSetCookieHeader = refreshRes.headers.get("set-cookie");
        if (newSetCookieHeader) {
          const match = newSetCookieHeader.match(/accessToken=([^;]+)/);
          if (match) {
            accessToken = match[1];
          }
        }
      }
    } catch {
      // refresh chaqiruvi muvaffaqiyatsiz bo'lsa, pastdagi oddiy logika ishlaydi
    }
  }

  const activePayload =
    getValidPayload(accessToken) || getValidPayload(refreshToken);

  // ==========================================
  // 2. PAGE REDIRECT LOGIC (Faqat sahifalar uchun)
  // ==========================================
  if (!isApiRoute) {
    const hasToken = Boolean(accessToken || refreshToken);

    if (!hasToken && !isPublicRoute) {
      const loginUrl = new URL("/auth/signin", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (getValidPayload(accessToken) && isPublicRoute) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ==========================================
  // 3. HEADER ATTACHMENT (API va Page so'rovlar uchun)
  // ==========================================
  const requestHeaders = new Headers(req.headers);

  if (activePayload) {
    requestHeaders.set("x-user-payload", JSON.stringify(activePayload));
  }

  // Agar yangi accessToken kelgan bo'lsa, keyingi so'rovlarga ham forward qilamiz
  if (accessToken) {
    const existingCookie = requestHeaders.get("cookie") || "";
    const cookieWithoutOldAccess = existingCookie
      .split("; ")
      .filter((c) => !c.startsWith("accessToken="))
      .join("; ");
    requestHeaders.set(
      "cookie",
      [cookieWithoutOldAccess, `accessToken=${accessToken}`]
        .filter(Boolean)
        .join("; "),
    );
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Brauzerga yangi accessToken cookie'sini forward qilamiz
  if (newSetCookieHeader) {
    response.headers.set("set-cookie", newSetCookieHeader);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
