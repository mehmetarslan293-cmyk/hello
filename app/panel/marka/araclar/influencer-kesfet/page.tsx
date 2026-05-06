 "use client";

import { useEffect, useState } from "react";
import { fmtFollowers, fmtMoney, kesfetCategories, kesfetSample } from "@/lib/brand-panel/mock-data";

export default function InfluencerKesfetPage() {
  const [platformFilter, setPlatformFilter] = useState<"Tumu" | "Instagram Reels" | "TikTok">("Tumu");
  const [categoryFilter, setCategoryFilter] = useState("Tumu");
  const [genderFilter, setGenderFilter] = useState<"Tumu" | "Kadın" | "Erkek">("Tumu");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"followers" | "engagement">("followers");
  const [wallet, setWallet] = useState<{ walletBalance: number; blockedAmount: number; availableBalance: number } | null>(
    null,
  );
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [offerType, setOfferType] = useState<"ucretli" | "barter">("ucretli");
  const [productUrl, setProductUrl] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [brief, setBrief] = useState("");
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState("");

  useEffect(() => {
    fetch("/api/brand/offer-balance", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok) {
          setWallet({
            walletBalance: data.walletBalance,
            blockedAmount: data.blockedAmount,
            availableBalance: data.availableBalance,
          });
        }
      })
      .catch(() => null);
  }, []);

  const rows = kesfetSample
    .filter((r) => {
      if (platformFilter !== "Tumu" && r.platform !== platformFilter) return false;
      if (categoryFilter !== "Tumu" && r.category !== categoryFilter) return false;
      if (genderFilter !== "Tumu" && r.gender !== genderFilter) return false;
      if (query.trim() && !`${r.handle} ${r.name}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) =>
      sortBy === "engagement" ? b.engagementRate - a.engagementRate : b.followers - a.followers,
    );

  async function submitOffer(handle: string, fullName: string) {
    const normalizedUrl = productUrl.trim();
    const price = Number(productPrice);
    if (!normalizedUrl || Number.isNaN(price) || price <= 0) {
      setInfo("Trendyol urun linki ve urun tutari zorunludur.");
      return;
    }
    if (offerType === "ucretli" && wallet && price > wallet.availableBalance) {
      setInfo("Yetersiz kullanilabilir bakiye. Blokedeki teklifler dusuldukten sonra kalan bakiye ile teklif verebilirsiniz.");
      return;
    }

    try {
      setBusy(true);
      setInfo("");
      const payload = {
        title: `${handle} teklif dosyasi`,
        campaignType: offerType === "barter" ? "Barter teklif" : "Ucretli teklif",
        budgetTotal: price,
        objective: "Influencer secimi",
        description: [
          `INFLUENCER_HANDLE:${handle}`,
          `INFLUENCER_NAME:${fullName}`,
          `OFFER_TYPE:${offerType}`,
          `PRODUCT_URL:${normalizedUrl}`,
          `PRODUCT_PRICE:${price}`,
          brief.trim() ? `BRIEF:${brief.trim()}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      };
      const res = await fetch("/api/campaigns", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "Teklif olusturulamadi");
      }

      setInfo(`${handle} icin teklif olusturuldu. Teklif & is akisi ekranindan takip edebilirsiniz.`);
      setOpenFor(null);
      setProductUrl("");
      setProductPrice("");
      setBrief("");
      if (data?.offerBalance) {
        setWallet({
          walletBalance: data.offerBalance.walletBalance,
          blockedAmount: data.offerBalance.blockedAmount,
          availableBalance: data.offerBalance.availableBalance,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Teklif olusturulamadi";
      setInfo(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6 xl:flex-row">
      <aside className="w-full shrink-0 space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:w-72">
        <div className="rounded-xl bg-gray-100 p-2 text-center text-xs font-semibold text-gray-700">
          Manuel filtreler
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase text-gray-500">Platform</label>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as "Tumu" | "Instagram Reels" | "TikTok")}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900"
          >
            <option>Tumu</option>
            <option>Instagram Reels</option>
            <option>TikTok</option>
          </select>
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase text-gray-500">Kategoriler</label>
          <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto text-sm">
            <li
              className={`flex cursor-pointer justify-between rounded-lg px-2 py-1.5 ${categoryFilter === "Tumu" ? "bg-pink-50 text-pink-700" : "hover:bg-gray-50"}`}
              onClick={() => setCategoryFilter("Tumu")}
            >
              <span>Tumu</span>
              <span>—</span>
            </li>
            {kesfetCategories.map((c) => (
              <li
                key={c.name}
                className={`flex cursor-pointer justify-between rounded-lg px-2 py-1.5 ${categoryFilter === c.name ? "bg-pink-50 text-pink-700" : "hover:bg-gray-50"}`}
                onClick={() => setCategoryFilter(c.name)}
              >
                <span className="text-gray-700">{c.name}</span>
                <span className="text-gray-400">{c.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase text-gray-500">Cinsiyet</label>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as "Tumu" | "Kadın" | "Erkek")}
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900"
          >
            <option>Tumu</option>
            <option>Kadın</option>
            <option>Erkek</option>
          </select>
        </div>
      </aside>

      <div className="min-w-0 flex-1 space-y-4">
        <div className="rounded-2xl border border-pink-100 bg-pink-50/60 p-4 text-sm text-gray-700">
          <p className="font-semibold text-gray-900">Yeni akis</p>
          <p className="mt-1">
            Marka kampanya olusturmaz; bu ekrandan influencer secer, ucretli teklif veya barter teklifi gecer.
            Influencer onayladiginda brief acilir ve odeme escrowda tutulur.
          </p>
        </div>
        {info ? (
          <p className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">{info}</p>
        ) : null}
        {wallet ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm">
              <p className="text-gray-500">Toplam bakiye</p>
              <p className="font-semibold text-gray-900">{fmtMoney(wallet.walletBalance)}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
              <p className="text-amber-700">Blokedeki tutar</p>
              <p className="font-semibold text-amber-800">{fmtMoney(wallet.blockedAmount)}</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm">
              <p className="text-emerald-700">Kullanilabilir bakiye</p>
              <p className="font-semibold text-emerald-800">{fmtMoney(wallet.availableBalance)}</p>
            </div>
          </div>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            placeholder="Kullanıcı adına göre arama"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full max-w-md rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 sm:flex-1"
          />
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{rows.length} sonuç</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "followers" | "engagement")}
              className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-900"
            >
              <option value="followers">Sırala: Takipçi</option>
              <option value="engagement">Sırala: Etkileşim oranı</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Profil</th>
                <th className="px-4 py-3 text-right">Takipçi</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Ülke</th>
                <th className="px-4 py-3">Şehir</th>
                <th className="px-4 py-3 text-right">Etkileşim oranı</th>
                <th className="px-4 py-3 text-right">Story ücreti</th>
                <th className="px-4 py-3 text-right">Reels ücreti</th>
                <th className="px-4 py-3 text-right">TikTok video ücreti</th>
                <th className="px-4 py-3 text-right">Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.handle} className="border-b border-gray-50 hover:bg-gray-50/80">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 to-violet-200 text-xs font-bold text-gray-700">
                        {r.handle[1]?.toUpperCase() ?? "?"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {r.handle}
                          {r.verified ? <span className="ml-1 text-blue-500">✓</span> : null}
                        </p>
                        <p className="text-xs text-gray-500">{r.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right tabular-nums font-medium text-gray-900">{fmtFollowers(r.followers)}</td>
                  <td className="px-4 py-4 text-gray-700">{r.category}</td>
                  <td className="px-4 py-4">{r.country}</td>
                  <td className="px-4 py-4 text-gray-600">{r.city}</td>
                  <td className="px-4 py-4 text-right font-medium text-gray-900">%{r.engagementRate.toFixed(1)}</td>
                  <td className="px-4 py-4 text-right tabular-nums text-gray-900">{fmtMoney(r.storyPrice)}</td>
                  <td className="px-4 py-4 text-right tabular-nums text-gray-900">{fmtMoney(r.reelsPrice)}</td>
                  <td className="px-4 py-4 text-right tabular-nums text-gray-900">{fmtMoney(r.tiktokPrice)}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setOfferType("barter");
                          setOpenFor(r.handle);
                          setInfo("");
                        }}
                        className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-700 hover:bg-gray-50"
                      >
                        Barter teklif
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOfferType("ucretli");
                          setOpenFor(r.handle);
                          setInfo("");
                        }}
                        className="rounded-full bg-pink-600 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white hover:bg-pink-700"
                      >
                        Ucretli teklif
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {openFor ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900">Teklif olustur - {openFor}</h3>
            <p className="mt-1 text-sm text-gray-600">
              Trendyol urun linki ve urun tutari zorunludur. Influencer onaylarsa brief acilir ve odeme escrowa alinir.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Teklif tipi</label>
                <div className="mt-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800">
                  {offerType === "barter" ? "Barter teklif" : "Ucretli teklif"}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Urun tutari (TRY)</label>
                <input
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  inputMode="numeric"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                  placeholder="Orn: 2499"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Trendyol urun linki</label>
                <input
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                  placeholder="https://www.trendyol.com/..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Marka briefi</label>
                <textarea
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  className="mt-1 min-h-24 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                  placeholder="Icerik tonu, teslim tarihi, revize beklentisi..."
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setOpenFor(null)}
                className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 hover:bg-gray-50"
              >
                Vazgec
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  const hit = kesfetSample.find((x) => x.handle === openFor);
                  if (hit) void submitOffer(hit.handle, hit.name);
                }}
                className="rounded-full bg-pink-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Kaydediliyor..." : "Teklifi olustur"}
              </button>
            </div>
          </div>
        ) : null}
        <p className="text-center text-xs text-gray-500">
          Teklif onaylari, escrow sureci ve yayin sonrasi odeme dagitimi icin &quot;Teklif &amp; is akisi&quot; ekranini kullanin.
        </p>
      </div>
    </div>
  );
}
