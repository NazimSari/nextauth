import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Token veya rol yoksa kullanıcıyı reddet
    if (!token || !token.role) {
      return NextResponse.rewrite(new URL("/Denied", req.url));
    }

    // Yalnızca admin rolü olanlar CreateUser sayfasına erişebilir
    if (pathname.startsWith("/Public") && token.role !== "admin") {
      return NextResponse.rewrite(new URL("/Denied", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/Public"],
};
