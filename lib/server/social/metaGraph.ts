import { fetchWithRetry } from "./httpRetry";

/**
 * Meta Graph API — access token ile verilen IG user id'den takipci sayisini ceker.
 */
export async function fetchInstagramFollowersCount(args?: {
  accessToken?: string | null;
  igUserId?: string | null;
}): Promise<number | null> {
  const token = args?.accessToken ?? process.env.META_ACCESS_TOKEN;
  const igUserId = args?.igUserId ?? process.env.META_IG_USER_ID;
  if (!token || !igUserId) return null;

  const url = new URL(`https://graph.facebook.com/v19.0/${igUserId}`);
  url.searchParams.set("fields", "followers_count");
  url.searchParams.set("access_token", token);

  try {
    const res = await fetchWithRetry(url.toString(), { next: { revalidate: 0 } }, { retries: 2, baseDelayMs: 450 });
    if (!res.ok) return null;
    const data = (await res.json()) as { followers_count?: number };
    return typeof data.followers_count === "number" ? data.followers_count : null;
  } catch {
    return null;
  }
}

export async function refreshMetaAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  accessTokenExpiresAt: Date | null;
}> {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  if (!appId || !appSecret) {
    throw new Error("META_APP_ID ve META_APP_SECRET gerekli");
  }
  const url = new URL("https://graph.facebook.com/v19.0/oauth/access_token");
  url.searchParams.set("grant_type", "fb_exchange_token");
  url.searchParams.set("client_id", appId);
  url.searchParams.set("client_secret", appSecret);
  url.searchParams.set("fb_exchange_token", refreshToken);

  const res = await fetchWithRetry(url.toString(), { method: "GET", cache: "no-store" }, { retries: 2, baseDelayMs: 450 });
  if (!res.ok) {
    throw new Error(`Meta token yenileme basarisiz: ${res.status}`);
  }
  const json = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!json.access_token) throw new Error("Meta access token alinamadi");
  return {
    accessToken: json.access_token,
    accessTokenExpiresAt: json.expires_in ? new Date(Date.now() + json.expires_in * 1000) : null,
  };
}
