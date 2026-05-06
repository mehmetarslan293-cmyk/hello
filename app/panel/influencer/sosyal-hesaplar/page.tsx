"use client";

import { useEffect, useState } from "react";

type SocialConnection = {
  id: string;
  provider: "META" | "TIKTOK";
  providerUserId: string;
  updatedAt: string;
  accessTokenExpiresAt: string | null;
};

type SocialAccount = {
  id: string;
  platform: "INSTAGRAM" | "TIKTOK";
  username: string;
  profileUrl: string | null;
  followersSnapshot: number;
  updatedAt: string;
};

function getConnectionHealth(expiresAt: string | null): { label: string; cls: string } {
  if (!expiresAt) {
    return { label: "Süre bilgisi yok", cls: "bg-amber-100 text-amber-700" };
  }
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (Number.isNaN(ms)) {
    return { label: "Süre bilgisi geçersiz", cls: "bg-rose-100 text-rose-700" };
  }
  if (ms <= 0) {
    return { label: "Token süresi dolmuş", cls: "bg-rose-100 text-rose-700" };
  }
  const hours = ms / (1000 * 60 * 60);
  if (hours < 24) {
    return { label: "24 saatten az kaldı", cls: "bg-amber-100 text-amber-700" };
  }
  return { label: "Bağlantı sağlıklı", cls: "bg-emerald-100 text-emerald-700" };
}

function getAccountHealth(updatedAt: string): { label: string; cls: string } {
  const ageMs = Date.now() - new Date(updatedAt).getTime();
  if (Number.isNaN(ageMs)) {
    return { label: "Güncelleme tarihi geçersiz", cls: "bg-rose-100 text-rose-700" };
  }
  const ageHours = ageMs / (1000 * 60 * 60);
  if (ageHours > 48) {
    return { label: "Veri bayat (>48s)", cls: "bg-amber-100 text-amber-700" };
  }
  return { label: "Veri güncel", cls: "bg-emerald-100 text-emerald-700" };
}

export default function SosyalHesaplarPage() {
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [connectUrls, setConnectUrls] = useState<{ instagram: string; tiktok: string } | null>(null);
  const [igUsername, setIgUsername] = useState("");
  const [ttUsername, setTtUsername] = useState("");
  const [socialInfo, setSocialInfo] = useState("");
  const [socialBusy, setSocialBusy] = useState(false);

  async function loadSocial() {
    const res = await fetch("/api/influencer/social-connections", { credentials: "include", cache: "no-store" });
    const data = await res.json();
    if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Sosyal bağlantılar alınamadı");
    setConnections(data.connections ?? []);
    setAccounts(data.accounts ?? []);
    setConnectUrls(data.connectUrls ?? null);
    const ig = (data.accounts ?? []).find((a: SocialAccount) => a.platform === "INSTAGRAM");
    const tt = (data.accounts ?? []).find((a: SocialAccount) => a.platform === "TIKTOK");
    setIgUsername(ig?.username ?? "");
    setTtUsername(tt?.username ?? "");
  }

  useEffect(() => {
    async function run() {
      try {
        await loadSocial();
      } catch (e) {
        setSocialInfo(e instanceof Error ? e.message : "Sosyal bağlantı verisi alınamadı");
      }
    }
    void run();
  }, []);

  async function saveAccount(platform: "INSTAGRAM" | "TIKTOK", username: string) {
    if (!username.trim()) {
      setSocialInfo("Kullanıcı adı / id boş olamaz.");
      return;
    }
    try {
      setSocialBusy(true);
      setSocialInfo("");
      const res = await fetch("/api/influencer/social-connections", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, username: username.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Kayıt başarısız");
      setSocialInfo(`${platform === "INSTAGRAM" ? "Instagram" : "TikTok"} hesabınız kaydedildi.`);
      await loadSocial();
    } catch (e) {
      setSocialInfo(e instanceof Error ? e.message : "Kayıt başarısız");
    } finally {
      setSocialBusy(false);
    }
  }

  async function syncNow() {
    try {
      setSocialBusy(true);
      setSocialInfo("");
      const res = await fetch("/api/influencer/social-sync", { method: "POST", credentials: "include" });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Senkron başarısız");
      setSocialInfo("Senkron başlatıldı, veriler güncelleniyor.");
      await loadSocial();
    } catch (e) {
      setSocialInfo(e instanceof Error ? e.message : "Senkron başarısız");
    } finally {
      setSocialBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-[980px] space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-hero text-lg font-bold text-gray-900">Sosyal hesap bağlantıları</h3>
          <button
            type="button"
            disabled={socialBusy}
            onClick={() => void syncNow()}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-800 disabled:opacity-60"
          >
            Veriyi şimdi senkronla
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-800">
          Instagram için IG User ID / TikTok için open_id veya username girin. OAuth ile bağlandığınızda bu alanlar otomatik dolar.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-gray-700">Instagram</p>
            <input
              value={igUsername}
              onChange={(e) => setIgUsername(e.target.value)}
              placeholder="IG user id veya username"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500"
            />
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                disabled={socialBusy}
                onClick={() => void saveAccount("INSTAGRAM", igUsername)}
                className="rounded-full bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
              >
                Kaydet
              </button>
              {connectUrls?.instagram ? (
                <a href={connectUrls.instagram} className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800">
                  OAuth bagla
                </a>
              ) : null}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-gray-700">TikTok</p>
            <input
              value={ttUsername}
              onChange={(e) => setTtUsername(e.target.value)}
              placeholder="TikTok open_id veya username"
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500"
            />
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                disabled={socialBusy}
                onClick={() => void saveAccount("TIKTOK", ttUsername)}
                className="rounded-full bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
              >
                Kaydet
              </button>
              {connectUrls?.tiktok ? (
                <a href={connectUrls.tiktok} className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800">
                  OAuth bagla
                </a>
              ) : null}
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
            <p className="font-semibold text-gray-800">Bağlı providerlar</p>
            {connections.length ? (
              <ul className="mt-2 space-y-1">
                {connections.map((c) => (
                  <li key={c.id} className="rounded-lg border border-gray-200 bg-white px-2 py-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-800">{c.provider}</span>
                      <span>· {c.providerUserId}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getConnectionHealth(c.accessTokenExpiresAt).cls}`}>
                        {getConnectionHealth(c.accessTokenExpiresAt).label}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-gray-700">
                      Son bağlantı: {new Date(c.updatedAt).toLocaleString("tr-TR")}
                    </p>
                    {getConnectionHealth(c.accessTokenExpiresAt).label !== "Bağlantı sağlıklı" ? (
                      <p className="mt-1 text-[10px] text-rose-600">
                        Uyarı: Yeniden OAuth bağlamanız gerekebilir.
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2">Henüz OAuth bağlantısı yok.</p>
            )}
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
            <p className="font-semibold text-gray-800">Kayıtlı platform hesapları</p>
            {accounts.length ? (
              <ul className="mt-2 space-y-1">
                {accounts.map((a) => (
                  <li key={a.id} className="rounded-lg border border-gray-200 bg-white px-2 py-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-800">{a.platform}</span>
                      <span>· {a.username}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getAccountHealth(a.updatedAt).cls}`}>
                        {getAccountHealth(a.updatedAt).label}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-gray-700">
                      Snapshot: {a.followersSnapshot} · Son güncelleme: {new Date(a.updatedAt).toLocaleString("tr-TR")}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2">Platform hesabı kayıtlı değil.</p>
            )}
          </div>
        </div>
        {socialInfo ? <p className="mt-3 text-sm font-medium text-gray-800">{socialInfo}</p> : null}
      </section>
    </div>
  );
}
