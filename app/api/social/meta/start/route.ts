import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { requireSession } from "@/lib/server/apiAuth";
import { issueOAuthState } from "@/lib/server/social/oauthState";

export async function GET(req: Request) {
  const { session, response } = await requireSession([Role.INFLUENCER]);
  if (!session?.user?.id || response) return response!;

  const appId = process.env.META_APP_ID;
  const redirectUri = process.env.META_REDIRECT_URI ?? `${new URL(req.url).origin}/api/social/meta/callback`;
  if (!appId) {
    return NextResponse.json({ error: "META_APP_ID gerekli" }, { status: 500 });
  }

  const authUrl = new URL("https://www.facebook.com/v19.0/dialog/oauth");
  authUrl.searchParams.set("client_id", appId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "instagram_basic,instagram_manage_insights,pages_show_list");
  authUrl.searchParams.set("state", await issueOAuthState("meta", session.user.id));
  return NextResponse.redirect(authUrl);
}
