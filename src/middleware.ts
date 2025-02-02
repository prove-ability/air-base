import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { env } from "@/env";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: env.AUTH_SECRET });
  console.log("token", token);

  // 공개 경로 패턴 (로그인하지 않아도 접근 가능)
  const publicPaths = ["/"];

  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  // 공개 경로가 아니고 토큰이 없으면 로그인 페이지로 리다이렉트
  if (!isPublicPath && !token) {
    const loginUrl = new URL("/api/auth/signin", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 이미 로그인한 사용자가 로그인/회원가입 페이지에 접근하면 메인으로 리다이렉트
  if (token && request.nextUrl.pathname.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// 모든 경로에 미들웨어 적용 (public 파일 제외)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public 폴더
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
