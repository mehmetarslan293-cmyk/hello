import { NextResponse } from "next/server";
import { Platform, Role, SocialProvider } from "@prisma/client";
import { requireSession } from "@/lib/server/apiAuth";
import { prisma } from "@/lib/server/prisma";

export async function GET(req: Request) {
  const { session, response } = await requireSession([Role.INFLUENCER]);
  if (!session?.user?.id || response) return response!;

  const influencer = await prisma.influencerProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!influencer) return NextResponse.json({ ok: true, connections: [], accounts: [] });

  const [connections, accounts] = await Promise.all([
    prisma.socialConnection.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        provider: true,
        providerUserId: true,
        updatedAt: true,
        accessTokenExpiresAt: true,
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.platformAccount.findMany({
      where: {
        influencerId: influencer.id,
        platform: { in: [Platform.INSTAGRAM, Platform.TIKTOK] },
      },
      select: {
        id: true,
        platform: true,
        username: true,
        profileUrl: true,
        followersSnapshot: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const base = new URL(req.url).origin;
  return NextResponse.json({
    ok: true,
    connections,
    accounts,
    connectUrls: {
      instagram: `${base}/api/social/meta/start`,
      tiktok: `${base}/api/social/tiktok/start`,
    },
  });
}

export async function PATCH(req: Request) {
  const { session, response } = await requireSession([Role.INFLUENCER]);
  if (!session?.user?.id || response) return response!;

  const body = (await req.json()) as {
    platform?: "INSTAGRAM" | "TIKTOK";
    username?: string;
    profileUrl?: string;
  };
  if (!body.platform || !body.username?.trim()) {
    return NextResponse.json({ error: "platform ve username zorunlu" }, { status: 400 });
  }

  const influencer = await prisma.influencerProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!influencer) return NextResponse.json({ error: "Influencer profili bulunamadi" }, { status: 404 });

  const platform = body.platform === "INSTAGRAM" ? Platform.INSTAGRAM : Platform.TIKTOK;
  const username = body.username.trim();
  const profileUrl =
    body.profileUrl?.trim() ||
    (platform === Platform.INSTAGRAM
      ? `https://instagram.com/${username.replace(/^@/, "")}`
      : `https://www.tiktok.com/@${username.replace(/^@/, "")}`);

  const account = await prisma.platformAccount.upsert({
    where: {
      platform_username: { platform, username },
    },
    update: {
      influencerId: influencer.id,
      profileUrl,
    },
    create: {
      influencerId: influencer.id,
      platform,
      username,
      profileUrl,
    },
  });

  // Optional mapping: if user already OAuth-connected, keep providerUserId aligned with username/open_id text.
  const provider = platform === Platform.INSTAGRAM ? SocialProvider.META : SocialProvider.TIKTOK;
  const existingConn = await prisma.socialConnection.findFirst({
    where: { userId: session.user.id, provider },
    orderBy: { updatedAt: "desc" },
    select: { id: true },
  });
  if (existingConn) {
    await prisma.socialConnection.update({
      where: { id: existingConn.id },
      data: { providerUserId: username },
    });
  }

  return NextResponse.json({ ok: true, account });
}
