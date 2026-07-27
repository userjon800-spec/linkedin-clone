import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";
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
  const isApiRoute = pathname.startsWith("/api"); // <--- API route ekanligini aniqlaymiz
  const hasToken = Boolean(accessToken || refreshToken);
  // User tizimga kirgan deb hisoblanadi agar accessToken YOKI refreshToken bo'lsa
  // 2. Tizimga kirmagan bo'lsa va himoyalangan sahifaga kirmoqchi bo'lsa -> Login sahifasiga
  if (!isApiRoute) {
    // Tizimga kirmagan va protected sahifaga kirmoqchi
    if (!hasToken && !isPublicRoute) {
      const loginUrl = new URL("/auth/signin", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Tizimga kirgan va public sahifaga kirmoqchi
    // MUHIM CHETLAB O'TISH (LOOP OLDINI OLISH):
    // Faqat VALID accessToken bo'lgandagina public route'dan Home'ga redirect qilamiz.
    // Shunchaki refreshToken borligi uchun /auth/signin sahifasidan haydab yubormaymiz.
    if (accessToken && isPublicRoute) {
      try {
        const decoded = decodeJwt(accessToken);
        // Token muddati o'tmaganini tekshiramiz (exp soniyalarda beriladi)
        if (decoded.exp && decoded.exp * 1000 > Date.now()) {
          return NextResponse.redirect(new URL("/", req.url));
        }
      } catch (e) {
        // Token xato bo'lsa hech narsa qilmaydi, signin sahifasida qoladi
      }
    }
  }
  // ==========================================
  // 4. DECODE LOGIC (Tokenlarni dekod qilish)
  // ==========================================
  const requestHeaders = new Headers(req.headers);
  // Birinchi navbatda accessToken'ni, u bo'lmasa refreshToken'ni dekod qilamiz
  const activeToken = accessToken || refreshToken;
  if (activeToken) {
    try {
      const decodedPayload = decodeJwt(activeToken);
      if (decodedPayload) {
        // To'liq decoded payload'ni ham JSON shaklida saqlab qo'yish mumkin
        requestHeaders.set("x-user-payload", JSON.stringify(decodedPayload));
      }
    } catch (error) {
      console.error("Middleware token decode error:", error);
      // Decode xatosi bo'lsa ham foydalanuvchini bloklamaymiz, so'rov davom etaveradi
    }
  }
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
export const config = {
  matcher: [
    /*
     * Statik fayllar, rasmlar va public fayllardan TASHQARI
     * barcha yo'llarda (shu jumladan /api/... da ham) ishlaydi
     * Chunki sababi middleware api requestlarini qabul qilib ulardagi token'ni dekod qilishi kerak agar matcher api cheklab o'tilsa u bunday qila olmaydi va xatolikga olib keladi
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
