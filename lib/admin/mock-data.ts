/** Demo yönetici paneli verisi — üretimde API / DB ile değiştirin */

export type BrandRow = {
  id: string;
  name: string;
  email: string;
  balanceTry: number;
  escrowTry: number;
  spent30dTry: number;
  campaignsActive: number;
  status: "aktif" | "beklemede" | "askiya";
  joinedAt: string;
};

export type InfluencerRow = {
  id: string;
  handle: string;
  email: string;
  tier: "altın" | "gümüş" | "bronz";
  followers: number;
  earnings30dTry: number;
  campaignsDone: number;
  status: "onaylı" | "incelemede" | "reddedildi";
  joinedAt: string;
};

export type CampaignRow = {
  id: string;
  brand: string;
  title: string;
  budgetTry: number;
  spentTry: number;
  influencers: number;
  status: "taslak" | "aktif" | "tamamlandi" | "iptal";
  deadline: string;
};

export type LedgerRow = {
  id: string;
  at: string;
  type: "yukleme" | "kampanya_odeme" | "hakedis" | "komisyon" | "iade";
  party: string;
  amountTry: number;
  balanceAfterTry: number;
};

export type TicketRow = {
  id: string;
  subject: string;
  from: string;
  role: "marka" | "influencer";
  priority: "dusuk" | "normal" | "yuksek";
  status: "acik" | "islemde" | "kapali";
  updatedAt: string;
};

export type AuditRow = {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail: string;
};

export const kpis = {
  brandsTotal: 142,
  influencersTotal: 891,
  influencersVerified: 624,
  campaignsActive: 47,
  campaignsTotalAllTime: 1284,
  gmv30dTry: 2_847_500,
  platformFee30dTry: 142_375,
  escrowTotalTry: 410_200,
  payoutsPendingTry: 89_400,
  newUsers7d: 156,
  newUsers30d: 612,
  ticketsOpen: 23,
  avgResponseHours: 4.2,
};

export const brands: BrandRow[] = [
  {
    id: "b1",
    name: "Aura Kozmetik",
    email: "partner@aurakozmetik.com",
    balanceTry: 125_000,
    escrowTry: 42_000,
    spent30dTry: 318_000,
    campaignsActive: 3,
    status: "aktif",
    joinedAt: "2024-06-12",
  },
  {
    id: "b2",
    name: "Neo Tekstil",
    email: "kampanya@neotekstil.tr",
    balanceTry: 34_500,
    escrowTry: 12_400,
    spent30dTry: 156_200,
    campaignsActive: 2,
    status: "aktif",
    joinedAt: "2025-01-08",
  },
  {
    id: "b3",
    name: "Fresh Gıda",
    email: "iletisim@freshgida.com",
    balanceTry: 0,
    escrowTry: 0,
    spent30dTry: 89_000,
    campaignsActive: 0,
    status: "beklemede",
    joinedAt: "2026-02-20",
  },
  {
    id: "b4",
    name: "Sky Travel",
    email: "marketing@skytravel.co",
    balanceTry: 210_800,
    escrowTry: 88_000,
    spent30dTry: 502_000,
    campaignsActive: 5,
    status: "aktif",
    joinedAt: "2023-11-03",
  },
];

export const influencers: InfluencerRow[] = [
  {
    id: "i1",
    handle: "@zeynepstyle",
    email: "zeynep@gmail.com",
    tier: "altın",
    followers: 428_000,
    earnings30dTry: 184_200,
    campaignsDone: 62,
    status: "onaylı",
    joinedAt: "2023-05-18",
  },
  {
    id: "i2",
    handle: "@buraktech",
    email: "burak.y@outlook.com",
    tier: "gümüş",
    followers: 112_000,
    earnings30dTry: 52_800,
    campaignsDone: 28,
    status: "onaylı",
    joinedAt: "2024-08-01",
  },
  {
    id: "i3",
    handle: "@elifs",
    email: "elif.s@gmail.com",
    tier: "bronz",
    followers: 24_500,
    earnings30dTry: 8_400,
    campaignsDone: 6,
    status: "incelemede",
    joinedAt: "2026-03-10",
  },
];

export const campaigns: CampaignRow[] = [
  {
    id: "c1",
    brand: "Aura Kozmetik",
    title: "Yaz koleksiyonu tanıtımı",
    budgetTry: 180_000,
    spentTry: 142_000,
    influencers: 12,
    status: "aktif",
    deadline: "2026-05-15",
  },
  {
    id: "c2",
    brand: "Neo Tekstil",
    title: "SS hoodie ürün çekimi",
    budgetTry: 95_000,
    spentTry: 95_000,
    influencers: 8,
    status: "tamamlandi",
    deadline: "2026-04-01",
  },
  {
    id: "c3",
    brand: "Sky Travel",
    title: "Early booking reels",
    budgetTry: 220_000,
    spentTry: 67_500,
    influencers: 15,
    status: "aktif",
    deadline: "2026-06-30",
  },
];

export const ledger: LedgerRow[] = [
  {
    id: "t1",
    at: "2026-04-29 09:12",
    type: "kampanya_odeme",
    party: "Aura Kozmetik → Escrow",
    amountTry: -48_000,
    balanceAfterTry: 125_000,
  },
  {
    id: "t2",
    at: "2026-04-28 16:40",
    type: "hakedis",
    party: "@zeynepstyle",
    amountTry: 22_500,
    balanceAfterTry: 410_200,
  },
  {
    id: "t3",
    at: "2026-04-28 11:05",
    type: "yukleme",
    party: "Sky Travel",
    amountTry: 100_000,
    balanceAfterTry: 210_800,
  },
  {
    id: "t4",
    at: "2026-04-27 14:22",
    type: "komisyon",
    party: "Platform kesintisi",
    amountTry: 3_100,
    balanceAfterTry: 2_815_400,
  },
];

export const tickets: TicketRow[] = [
  {
    id: "d1",
    subject: "Ödeme gecikmesi — Nisan teslimatı",
    from: "Neo Tekstil",
    role: "marka",
    priority: "yuksek",
    status: "islemde",
    updatedAt: "2026-04-29",
  },
  {
    id: "d2",
    subject: "Profil doğrulama yeniden gönderimi",
    from: "@elifs",
    role: "influencer",
    priority: "normal",
    status: "acik",
    updatedAt: "2026-04-28",
  },
  {
    id: "d3",
    subject: "API webhook test ortamı",
    from: "Aura Kozmetik",
    role: "marka",
    priority: "dusuk",
    status: "kapali",
    updatedAt: "2026-04-25",
  },
];

export const auditLog: AuditRow[] = [
  {
    id: "a1",
    at: "2026-04-29 08:55",
    actor: "admin@example.com",
    action: "kampanya.duraklat",
    detail: "c3 — bütçe eşiği uyarısı",
  },
  {
    id: "a2",
    at: "2026-04-28 19:10",
    actor: "admin@example.com",
    action: "influencer.onay",
    detail: "i2 — belge doğrulandı",
  },
  {
    id: "a3",
    at: "2026-04-27 10:00",
    actor: "sistem",
    action: "otomatik.payout.kuyruk",
    detail: "12 influencer ödemesi sıraya alındı",
  },
];

/** Haftalık kayıt (demo grafik) */
export const signupsWeekly = [
  { label: "H1", brands: 12, influencers: 44 },
  { label: "H2", brands: 18, influencers: 52 },
  { label: "H3", brands: 9, influencers: 38 },
  { label: "H4", brands: 22, influencers: 61 },
];

export function formatTry(n: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatCompact(n: number) {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
