import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function proxy(req) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const isLoggedIn = !!token;
  const isLoginPage = pathname === "/login";

  // User is NOT logged in
  // and trying to access any protected route
  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  // User IS logged in
  // and trying to access login page
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(
      new URL("/", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};