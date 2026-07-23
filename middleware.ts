import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;
  // 1. Ochiq (har kim kirishi mumkin bo'lgan) sahifalar
  const publicRouters = [
    "/auth/signin",
    "/auth/signup",
    "/auth/forgot-password",
  ];
  const isPublicRoute = publicRouters.some((route) =>
    pathname.startsWith(route),
  );
  // User tizimga kirgan deb hisoblanadi agar accessToken YOKI refreshToken bo'lsa
  const isAuthenticated = Boolean(accessToken || refreshToken);
  // 2. Tizimga kirmagan bo'lsa va himoyalangan sahifaga kirmoqchi bo'lsa -> Login sahifasiga
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL("/auth/signin", req.url);
    // Foydalanuvchi logindan o'tgach yana o'zi kirmoqchi bo'lgan sahifaga qaytishi uchun:
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
  // 3. Tizimga kirgan bo'lsa va login/signup sahifasiga kirmoqchi bo'lsa -> Bosh sahifaga
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    /*
     * Quyidagilardan TASHQARI barcha yo'llarda ishlaydi:
     * - api (API route'lar)
     * - _next/static (Statik fayllar)
     * - _next/image (Rasm optimizatsiyasi)
     * - favicon.ico, sitemap.xml, robots.txt (Fayllar)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};