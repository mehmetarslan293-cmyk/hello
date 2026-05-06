import { NextResponse } from "next/server";
import { Role, SocialProvider } from "@prisma/client";
import { requireSession } from "@/lib/server/apiAuth";
import { prisma } from "@/lib/server/prisma";
import { upsertSocialConnection } from "@/lib/server/social/tokenStore";
import { verifyAndConsumeOAuthState } from "@/lib/server/social/oauthState";

export async function GET(req: Request) {
  const { session, response } = await requireSession([Role.INFLUENCER]);
  if (!session?.user?.id || response) return response!;

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code) {
    return NextResponse.json({ error: "code bulunamadi" }, { status: 400 });
  }
  if (!state || !(await verifyAndConsumeOAuthState("tiktok", session.user.id, state))) {
    return NextResponse.json({ error: "Gecersiz oauth state" }, { status: 400 });
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI ?? `${url.origin}/api/social/tiktok/callback`;
  if (!clientKey || !clientSecret) {
    return NextResponse.json({ error: "TIKTOK_CLIENT_KEY ve TIKTOK_CLIENT_SECRET gerekli" }, { status: 500 });
  }

  const body = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });
  const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  if (!tokenRes.ok) {
    return NextResponse.json({ error: "TikTok token alinmadi", detail: await tokenRes.text() }, { status: 400 });
  }
  const tokenJson = (await tokenRes.json()) as {
    access_token?: string;
    refresh_token?: string;
    open_id?: string;
    expires_in?: number;
    refresh_expires_in?: number;
  };
  if (!tokenJson.access_token || !tokenJson.open_id) {
    return NextResponse.json({ error: "TikTok access token/open_id eksik" }, { status: 400 });
  }

  await upsertSocialConnection({
    userId: session.user.id,
    provider: SocialProvider.TIKTOK,
    providerUserId: tokenJson.open_id,
    accessToken: tokenJson.access_token,
    refreshToken: tokenJson.refresh_token ?? null,
    accessTokenExpiresAt: tokenJson.expires_in ? new Date(Date.now() + tokenJson.expires_in * 1000) : null,
    refreshTokenExpiresAt: tokenJson.refresh_expires_in
      ? new Date(Date.now() + tokenJson.refresh_expires_in * 1000)
      : null,
  });

  const influencer = await prisma.influencerProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (influencer) {
    await prisma.platformAccount.upsert({
      where: {
        platform_username: {
          platform: "TIKTOK",
          username: tokenJson.open_id,
        },
      },
      update: {
        influencerId: influencer.id,
        profileUrl: `https://www.tiktok.com/@${tokenJson.open_id}`,
      },
      create: {
        influencerId: influencer.id,
        platform: "TIKTOK",
        username: tokenJson.open_id,
        profileUrl: `https://www.tiktok.com/@${tokenJson.open_id}`,
      },
    });
  }

  return NextResponse.redirect(new URL("/panel/influencer/top-influencerlar", url.origin));
}
