import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const LOGIN_PATH = "/admin/login";
const DEFAULT_ADMIN_PATH = "/admin/orders";

export default async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (pathname === LOGIN_PATH) {
    if (token) {
      return NextResponse.redirect(new URL(DEFAULT_ADMIN_PATH, request.url));
    }

    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    const callbackUrl = `${pathname}${search}`;

    if (callbackUrl !== LOGIN_PATH) {
      loginUrl.searchParams.set("callbackUrl", callbackUrl);
    }

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
