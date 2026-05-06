import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { requireSession } from "@/lib/server/apiAuth";
import { issueOAuthState } from "@/lib/server/social/oauthState";

export async function GET(req: Request) {
  const { session, response } = await requireSession([Role.INFLUENCER]);
  if (!session?.user?.id || response) return response!;

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI ?? `${new URL(req.url).origin}/api/social/tiktok/callback`;
  if (!clientKey) {
    return NextResponse.json({ error: "TIKTOK_CLIENT_KEY gerekli" }, { status: 500 });
  }

  const authUrl = new URL("https://www.tiktok.com/v2/auth/authorize/");
  authUrl.searchParams.set("client_key", clientKey);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "user.info.basic");
  authUrl.searchParams.set("state", await issueOAuthState("tiktok", session.user.id));
  return NextResponse.redirect(authUrl);
}
