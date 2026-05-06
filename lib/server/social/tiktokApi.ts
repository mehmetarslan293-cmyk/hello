import { fetchWithRetry } from "./httpRetry";

/**
 * TikTok Open API follower metrikleri.
 */
export async function fetchTikTokDisplayMetrics(
  _username: string,
  accessToken?: string | null,
): Promise<{ followers: number; avgViews: number } | null> {
  const token = accessToken ?? process.env.TIKTOK_ACCESS_TOKEN;
  if (!token) return null;
  try {
    const res = await fetchWithRetry("https://open.tiktokapis.com/v2/user/info/?fields=follower_count", {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 },
    }, { retries: 2, baseDelayMs: 450 });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      data?: { user?: { follower_count?: number } };
    };
    const followers = json.data?.user?.follower_count;
    if (typeof followers !== "number") return null;
    return { followers, avgViews: 0 };
  } catch {
    return null;
  }
}

export async function refreshTikTokAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken?: string | null;
  accessTokenExpiresAt?: Date | null;
  refreshTokenExpiresAt?: Date | null;
}> {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  if (!clientKey || !clientSecret) {
    throw new Error("TIKTOK_CLIENT_KEY ve TIKTOK_CLIENT_SECRET gerekli");
  }

  const body = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const res = await fetchWithRetry("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  }, { retries: 2, baseDelayMs: 450 });
  if (!res.ok) {
    throw new Error(`TikTok token yenileme basarisiz: ${res.status}`);
  }
  const json = (await res.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    refresh_expires_in?: number;
  };
  if (!json.access_token) throw new Error("TikTok access token alinamadi");
  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token ?? null,
    accessTokenExpiresAt: json.expires_in ? new Date(Date.now() + json.expires_in * 1000) : null,
    refreshTokenExpiresAt: json.refresh_expires_in ? new Date(Date.now() + json.refresh_expires_in * 1000) : null,
  };
}
