import { SocialProvider } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { decryptText, encryptText } from "@/lib/server/crypto";

type RefreshResult = {
  accessToken: string;
  refreshToken?: string | null;
  accessTokenExpiresAt?: Date | null;
  refreshTokenExpiresAt?: Date | null;
};

export async function upsertSocialConnection(args: {
  userId: string;
  provider: SocialProvider;
  providerUserId: string;
  accessToken: string;
  refreshToken?: string | null;
  accessTokenExpiresAt?: Date | null;
  refreshTokenExpiresAt?: Date | null;
}) {
  const accessTokenEncrypted = encryptText(args.accessToken);
  const refreshTokenEncrypted = args.refreshToken ? encryptText(args.refreshToken) : null;
  return prisma.socialConnection.upsert({
    where: {
      provider_providerUserId: {
        provider: args.provider,
        providerUserId: args.providerUserId,
      },
    },
    update: {
      userId: args.userId,
      accessTokenEncrypted,
      refreshTokenEncrypted,
      accessTokenExpiresAt: args.accessTokenExpiresAt ?? null,
      refreshTokenExpiresAt: args.refreshTokenExpiresAt ?? null,
    },
    create: {
      userId: args.userId,
      provider: args.provider,
      providerUserId: args.providerUserId,
      accessTokenEncrypted,
      refreshTokenEncrypted,
      accessTokenExpiresAt: args.accessTokenExpiresAt ?? null,
      refreshTokenExpiresAt: args.refreshTokenExpiresAt ?? null,
    },
  });
}

export async function getDecryptedSocialToken(userId: string, provider: SocialProvider) {
  const row = await prisma.socialConnection.findFirst({
    where: { userId, provider },
    orderBy: { updatedAt: "desc" },
  });
  if (!row) return null;
  return {
    ...row,
    accessToken: decryptText(row.accessTokenEncrypted),
    refreshToken: row.refreshTokenEncrypted ? decryptText(row.refreshTokenEncrypted) : null,
  };
}

export async function getDecryptedSocialTokenByProviderUserId(provider: SocialProvider, providerUserId: string) {
  const row = await prisma.socialConnection.findUnique({
    where: {
      provider_providerUserId: { provider, providerUserId },
    },
  });
  if (!row) return null;
  return {
    ...row,
    accessToken: decryptText(row.accessTokenEncrypted),
    refreshToken: row.refreshTokenEncrypted ? decryptText(row.refreshTokenEncrypted) : null,
  };
}

export async function getValidAccessToken(args: {
  userId: string;
  provider: SocialProvider;
  refresh: (refreshToken: string) => Promise<RefreshResult>;
}): Promise<string | null> {
  const tokenRow = await getDecryptedSocialToken(args.userId, args.provider);
  if (!tokenRow) return null;

  const now = Date.now();
  const expiresAt = tokenRow.accessTokenExpiresAt?.getTime() ?? 0;
  const hasTime = expiresAt > 0;
  const stillValid = !hasTime || expiresAt - now > 60_000;
  if (stillValid) return tokenRow.accessToken;

  if (!tokenRow.refreshToken) return null;
  const refreshed = await args.refresh(tokenRow.refreshToken);
  await upsertSocialConnection({
    userId: tokenRow.userId,
    provider: tokenRow.provider,
    providerUserId: tokenRow.providerUserId,
    accessToken: refreshed.accessToken,
    refreshToken: refreshed.refreshToken ?? tokenRow.refreshToken,
    accessTokenExpiresAt: refreshed.accessTokenExpiresAt ?? tokenRow.accessTokenExpiresAt,
    refreshTokenExpiresAt: refreshed.refreshTokenExpiresAt ?? tokenRow.refreshTokenExpiresAt,
  });
  return refreshed.accessToken;
}
