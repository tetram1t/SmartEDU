import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { Role } from "@smartedu/shared";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check roles based on path
    if (path.startsWith("/admin") && token?.role !== Role.ADMIN) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (path.startsWith("/teacher") && token?.role !== Role.TEACHER) {
      if (token?.role === Role.ADMIN) {
         // Admins might also access teacher dashboard if needed
      } else {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
    if (path.startsWith("/student") && token?.role !== Role.STUDENT) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    }
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/teacher/:path*",
    "/student/:path*",
    "/dashboard/:path*",
  ]
};
