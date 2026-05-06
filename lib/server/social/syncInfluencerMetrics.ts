import { Platform, SocialProvider } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { fetchInstagramFollowersCount, refreshMetaAccessToken } from "./metaGraph";
import { fetchTikTokDisplayMetrics, refreshTikTokAccessToken } from "./tiktokApi";
import { getDecryptedSocialTokenByProviderUserId, getValidAccessToken } from "./tokenStore";

function startOfDayUtc(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

async function upsertSnapshot(args: {
  influencerId: string;
  platform: Platform;
  followers: number;
  avgViews: number;
  capturedAt: Date;
  snapshotDate: Date;
}) {
  await prisma.influencerMetricSnapshot.upsert({
    where: {
      influencerId_platform_snapshotDate: {
        influencerId: args.influencerId,
        platform: args.platform,
        snapshotDate: args.snapshotDate,
      },
    },
    update: {
      followers: args.followers,
      avgViews: args.avgViews,
      capturedAt: args.capturedAt,
    },
    create: args,
  });
}

export async function syncAllInfluencerMetrics(): Promise<{ accounts: number; snapshots: number }> {
  return syncInfluencerMetrics();
}

export async function syncInfluencerMetrics(influencerId?: string): Promise<{ accounts: number; snapshots: number }> {
  const accounts = await prisma.platformAccount.findMany({
    where: { influencerId: influencerId ?? undefined },
    include: { influencer: { include: { user: { select: { id: true } } } } },
  });
  const capturedAt = new Date();
  const snapshotDate = startOfDayUtc(capturedAt);
  let snapshots = 0;

  for (const acc of accounts) {
    let followers = acc.followersSnapshot;
    let avgViews = 0;

    if (acc.platform === Platform.INSTAGRAM) {
      const tokenByProviderUser = await getDecryptedSocialTokenByProviderUserId(SocialProvider.META, acc.username);
      const token =
        tokenByProviderUser?.accessToken ??
        (await getValidAccessToken({
          userId: acc.influencer.user.id,
          provider: SocialProvider.META,
          refresh: async (refreshToken) => {
            const refreshed = await refreshMetaAccessToken(refreshToken);
            return { accessToken: refreshed.accessToken, accessTokenExpiresAt: refreshed.accessTokenExpiresAt };
          },
        })) ??
        process.env.META_ACCESS_TOKEN;

      const igFollowers = await fetchInstagramFollowersCount({
        accessToken: token,
        igUserId: acc.username,
      });
      if (igFollowers != null) {
        followers = igFollowers;
      }
    } else if (acc.platform === Platform.TIKTOK) {
      const tokenByProviderUser = await getDecryptedSocialTokenByProviderUserId(SocialProvider.TIKTOK, acc.username);
      const token =
        tokenByProviderUser?.accessToken ??
        (await getValidAccessToken({
          userId: acc.influencer.user.id,
          provider: SocialProvider.TIKTOK,
          refresh: refreshTikTokAccessToken,
        })) ??
        process.env.TIKTOK_ACCESS_TOKEN;

      const tt = await fetchTikTokDisplayMetrics(acc.username, token);
      if (tt) {
        followers = tt.followers;
        avgViews = tt.avgViews;
      }
    }

    await upsertSnapshot({
        influencerId: acc.influencerId,
        platform: acc.platform,
        followers,
        avgViews,
        capturedAt,
        snapshotDate,
    });
    snapshots += 1;

    await prisma.platformAccount.update({
      where: { id: acc.id },
      data: { followersSnapshot: followers },
    });
  }

  const profiles = await prisma.influencerProfile.findMany({
    where: { id: influencerId ?? undefined },
    include: { platformAccounts: true },
  });

  for (const inf of profiles) {
    if (inf.platformAccounts.length) continue;
    await upsertSnapshot({
        influencerId: inf.id,
        platform: Platform.INSTAGRAM,
        followers: inf.followers,
        avgViews: 0,
        capturedAt,
        snapshotDate,
    });
    snapshots += 1;
  }

  return { accounts: accounts.length, snapshots };
}
