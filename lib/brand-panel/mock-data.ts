/** Marka paneli demo içeriği */

export type CampaignTypeCard = {
  id: string;
  title: string;
  desc: string;
  accent: string;
};

export const campaignTypes: CampaignTypeCard[] = [
  {
    id: "inf",
    title: "Influencer Marketing",
    desc: "Instagram / TikTok iş birlikleri",
    accent: "from-pink-500 to-rose-500",
  },
  {
    id: "free",
    title: "Ücretsiz ürün gönderimi",
    desc: "Barter kampanya",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    id: "ugc",
    title: "UGC kampanya",
    desc: "Kullanıcı içeriği üretimi",
    accent: "from-blue-500 to-indigo-500",
  },
  {
    id: "loc",
    title: "Lokasyon kampanyası",
    desc: "Konum bazlı görevler",
    accent: "from-orange-500 to-amber-500",
  },
  {
    id: "paid",
    title: "Ücretli ürün gönderimi",
    desc: "Ürün + ödeme",
    accent: "from-cyan-500 to-sky-500",
  },
  {
    id: "aff",
    title: "Affiliate kampanya",
    desc: "Performansa dayalı",
    accent: "from-orange-600 to-yellow-500",
  },
];

export type KesfetRow = {
  handle: string;
  name: string;
  verified: boolean;
  followers: number;
  category: string;
  country: string;
  city: string;
  gender: "Kadın" | "Erkek";
  platform: "Instagram Reels" | "TikTok";
  engagementRate: number;
  storyPrice: number;
  reelsPrice: number;
  tiktokPrice: number;
};

export const kesfetSample: KesfetRow[] = [
  {
    handle: "@jennaortega",
    name: "Jenna Ortega",
    verified: true,
    followers: 38_992_213,
    category: "Sinema & film",
    country: "US",
    city: "—",
    gender: "Kadın",
    platform: "Instagram Reels",
    engagementRate: 6.4,
    storyPrice: 120_000,
    reelsPrice: 220_000,
    tiktokPrice: 180_000,
  },
  {
    handle: "@filizkumpir",
    name: "Filiz",
    verified: false,
    followers: 182_400,
    category: "Yemek bloggerları",
    country: "TR",
    city: "İstanbul",
    gender: "Kadın",
    platform: "Instagram Reels",
    engagementRate: 5.1,
    storyPrice: 9_500,
    reelsPrice: 18_000,
    tiktokPrice: 15_500,
  },
  {
    handle: "@urfagurmee",
    name: "Urfa Gurme",
    verified: true,
    followers: 940_200,
    category: "Yemek bloggerları",
    country: "TR",
    city: "Şanlıurfa",
    gender: "Erkek",
    platform: "TikTok",
    engagementRate: 7.2,
    storyPrice: 26_000,
    reelsPrice: 42_000,
    tiktokPrice: 35_000,
  },
];

export type TrendClip = {
  id: string;
  handle: string;
  viral: number;
  views: string;
  likes: string;
  engagement: string;
  hook: string;
  tags: string;
};

export const trendClips: TrendClip[] = [
  {
    id: "t1",
    handle: "@filizkumpir",
    viral: 95,
    views: "18.1M",
    likes: "1.0M",
    engagement: "5.8%",
    hook: "Merak uyandırma — ilk 3 sn",
    tags: "food · işbirliği",
  },
  {
    id: "t2",
    handle: "@urfagurmee",
    viral: 90,
    views: "4.2M",
    likes: "412K",
    engagement: "4.1%",
    hook: "Açılış cümlesi · güçlü görsel",
    tags: "entertaining · yerel",
  },
];

export const kesfetCategories = [
  { name: "Yemek bloggerları", count: 1730 },
  { name: "Hamilelik & ebeveynlik", count: 1195 },
  { name: "Seyahat bloggerları", count: 1120 },
  { name: "Makyaj", count: 1040 },
  { name: "Stil & moda", count: 890 },
];

export function fmtFollowers(n: number) {
  return new Intl.NumberFormat("tr-TR").format(n);
}

export function fmtMoney(n: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(n);
}

export const BRAND_WALLET_TRY = 712;
