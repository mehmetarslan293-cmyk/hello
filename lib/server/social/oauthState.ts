import { createHmac, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_TTL_SECONDS = 10 * 60;

function stateSecret() {
  return process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "dev-only-secret-change-in-production-min-32-chars";
}

function sign(payload: string) {
  return createHmac("sha256", stateSecret()).update(payload).digest("hex");
}

export async function issueOAuthState(provider: "meta" | "tiktok", userId: string) {
  const nonce = randomBytes(12).toString("hex");
  const issuedAt = Date.now();
  const payload = `${provider}|${userId}|${issuedAt}|${nonce}`;
  const sig = sign(payload);
  const state = Buffer.from(`${payload}|${sig}`, "utf8").toString("base64url");
  const cookieStore = await cookies();
  cookieStore.set(`oauth_state_${provider}`, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_TTL_SECONDS,
    path: "/",
  });
  return state;
}

export async function verifyAndConsumeOAuthState(provider: "meta" | "tiktok", userId: string, state: string) {
  const cookieStore = await cookies();
  const cookieKey = `oauth_state_${provider}`;
  const expected = cookieStore.get(cookieKey)?.value;
  cookieStore.delete(cookieKey);
  if (!expected || expected !== state) return false;
  try {
    const raw = Buffer.from(state, "base64url").toString("utf8");
    const [p, uid, tsStr, nonce, sig] = raw.split("|");
    if (!p || !uid || !tsStr || !nonce || !sig) return false;
    if (p !== provider || uid !== userId) return false;
    const ts = Number(tsStr);
    if (!Number.isFinite(ts)) return false;
    if (Date.now() - ts > COOKIE_TTL_SECONDS * 1000) return false;
    const payload = `${p}|${uid}|${ts}|${nonce}`;
    return sign(payload) === sig;
  } catch {
    return false;
  }
}
