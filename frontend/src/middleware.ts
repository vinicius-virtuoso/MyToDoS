import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token_todo")?.value;
  const loginUrl = new URL("/login", req.url);
  const dashboardUrl = new URL("/dashboard", req.url);

  if (!token) {
    if (
      req.nextUrl.pathname !== "/" &&
      req.nextUrl.pathname !== "/login" &&
      req.nextUrl.pathname !== "/register"
    ) {
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (
    req.nextUrl.pathname === "/login" ||
    req.nextUrl.pathname === "/register" ||
    req.nextUrl.pathname === "/"
  ) {
    return NextResponse.redirect(dashboardUrl);
  }
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*", "/profile"],
};
