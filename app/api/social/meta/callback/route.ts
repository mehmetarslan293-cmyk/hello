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
  if (!state || !(await verifyAndConsumeOAuthState("meta", session.user.id, state))) {
    return NextResponse.json({ error: "Gecersiz oauth state" }, { status: 400 });
  }

  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const redirectUri = process.env.META_REDIRECT_URI ?? `${url.origin}/api/social/meta/callback`;
  if (!appId || !appSecret) {
    return NextResponse.json({ error: "META_APP_ID ve META_APP_SECRET gerekli" }, { status: 500 });
  }

  const tokenUrl = new URL("https://graph.facebook.com/v19.0/oauth/access_token");
  tokenUrl.searchParams.set("client_id", appId);
  tokenUrl.searchParams.set("client_secret", appSecret);
  tokenUrl.searchParams.set("redirect_uri", redirectUri);
  tokenUrl.searchParams.set("code", code);

  const tokenRes = await fetch(tokenUrl, { cache: "no-store" });
  if (!tokenRes.ok) {
    return NextResponse.json({ error: "Meta token alinmadi", detail: await tokenRes.text() }, { status: 400 });
  }
  const tokenJson = (await tokenRes.json()) as { access_token?: string; expires_in?: number };
  if (!tokenJson.access_token) {
    return NextResponse.json({ error: "Meta access token eksik" }, { status: 400 });
  }

  const meUrl = new URL("https://graph.facebook.com/v19.0/me");
  meUrl.searchParams.set("fields", "id");
  meUrl.searchParams.set("access_token", tokenJson.access_token);
  const meRes = await fetch(meUrl, { cache: "no-store" });
  if (!meRes.ok) {
    return NextResponse.json({ error: "Meta profil bilgisi alinamadi", detail: await meRes.text() }, { status: 400 });
  }
  const meJson = (await meRes.json()) as { id?: string };
  if (!meJson.id) {
    return NextResponse.json({ error: "Meta user id alinamadi" }, { status: 400 });
  }

  const longLivedUrl = new URL("https://graph.facebook.com/v19.0/oauth/access_token");
  longLivedUrl.searchParams.set("grant_type", "fb_exchange_token");
  longLivedUrl.searchParams.set("client_id", appId);
  longLivedUrl.searchParams.set("client_secret", appSecret);
  longLivedUrl.searchParams.set("fb_exchange_token", tokenJson.access_token);
  const longRes = await fetch(longLivedUrl, { cache: "no-store" });
  const finalTokenJson = longRes.ok
    ? ((await longRes.json()) as { access_token?: string; expires_in?: number })
    : tokenJson;
  const finalAccessToken = finalTokenJson.access_token ?? tokenJson.access_token;

  const igUserUrl = new URL("https://graph.facebook.com/v19.0/me/accounts");
  igUserUrl.searchParams.set("access_token", finalAccessToken);
  const pageRes = await fetch(igUserUrl, { cache: "no-store" });
  // Best effort: keep /me id as fallback if pages/account traversal unavailable.
  const providerUserId = meJson.id;

  await upsertSocialConnection({
    userId: session.user.id,
    provider: SocialProvider.META,
    providerUserId,
    accessToken: finalAccessToken,
    refreshToken: finalAccessToken,
    accessTokenExpiresAt: finalTokenJson.expires_in ? new Date(Date.now() + finalTokenJson.expires_in * 1000) : null,
  });

  const influencer = await prisma.influencerProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (influencer) {
    await prisma.platformAccount.upsert({
      where: {
        platform_username: {
          platform: "INSTAGRAM",
          username: providerUserId,
        },
      },
      update: {
        influencerId: influencer.id,
        profileUrl: `https://instagram.com/${providerUserId}`,
      },
      create: {
        influencerId: influencer.id,
        platform: "INSTAGRAM",
        username: providerUserId,
        profileUrl: `https://instagram.com/${providerUserId}`,
      },
    });
  }

  if (pageRes.ok) {
    // no-op placeholder: real IG business discovery can be extended here.
  }

  return NextResponse.redirect(new URL("/panel/influencer/top-influencerlar", url.origin));
}
