import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "dev-only-secret-change-in-production-min-32-chars";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/panel/marka") && !pathname.startsWith("/panel/influencer")) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret });
  if (!token?.id || !token.role) {
    const login = pathname.startsWith("/panel/marka") ? "/giris/marka" : "/giris/influencer";
    return NextResponse.redirect(new URL(login, request.url));
  }

  if (pathname.startsWith("/panel/marka") && token.role !== "BRAND") {
    return NextResponse.redirect(new URL("/giris/marka", request.url));
  }
  if (pathname.startsWith("/panel/influencer") && token.role !== "INFLUENCER") {
    return NextResponse.redirect(new URL("/giris/influencer", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/marka/:path*", "/panel/influencer/:path*"],
};
