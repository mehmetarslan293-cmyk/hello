import { PrismaClient, Role, AccountStatus, CampaignStatus, ApplicationStatus, Platform } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { createHash } from "node:crypto";

const sqliteUrl = (process.env.DATABASE_URL ?? "file:./dev.db").replace(/^file:/, "");
const adapter = new PrismaBetterSqlite3({ url: sqliteUrl });
const prisma = new PrismaClient({ adapter });
const hash = (v) => createHash("sha256").update(v).digest("hex");

async function upsertUsers() {
  const brandUser = await prisma.user.upsert({
    where: { email: "brand@example.com" },
    update: {},
    create: {
      email: "brand@example.com",
      passwordHash: hash("Brand12345"),
      fullName: "Marka Yonetici",
      role: Role.BRAND,
      status: AccountStatus.ACTIVE,
      brandProfile: {
        create: {
          brandName: "Demo Marka",
          website: "https://demo-marka.example",
          companyType: "LTD",
          sector: "Kozmetik",
          country: "TR",
        },
      },
      wallet: {
        create: {
          balance: 125000,
          escrowBalance: 42000,
        },
      },
    },
    include: { brandProfile: true },
  });

  const influencerUser = await prisma.user.upsert({
    where: { email: "influencer@example.com" },
    update: {},
    create: {
      email: "influencer@example.com",
      passwordHash: hash("Influencer12345"),
      fullName: "Mira Kaya",
      role: Role.INFLUENCER,
      status: AccountStatus.ACTIVE,
      influencerProfile: {
        create: {
          handle: "@mirakaya",
          city: "Istanbul",
          category: "Lifestyle",
          followers: 2334,
          engagementRate: 9.3,
          score: 93,
        },
      },
      wallet: {
        create: {
          balance: 12430,
          escrowBalance: 0,
        },
      },
    },
    include: { influencerProfile: true },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash: hash("Admin12345"),
      fullName: "Sistem Admin",
      role: Role.ADMIN,
      status: AccountStatus.ACTIVE,
      wallet: {
        create: {
          balance: 0,
          escrowBalance: 0,
        },
      },
    },
  });

  return { brandUser, influencerUser, adminUser };
}

async function upsertMetricSnapshots(influencerProfileId) {
  await prisma.influencerMetricSnapshot.deleteMany({ where: { influencerId: influencerProfileId } });
  const older = new Date(Date.now() - 12 * 86_400_000);
  const prevWindow = new Date(Date.now() - 10 * 86_400_000);
  const recent = new Date(Date.now() - 2 * 86_400_000);
  const now = new Date();
  await prisma.influencerMetricSnapshot.createMany({
    data: [
      { influencerId: influencerProfileId, platform: Platform.INSTAGRAM, followers: 1900, avgViews: 1200, capturedAt: older, snapshotDate: older },
      { influencerId: influencerProfileId, platform: Platform.TIKTOK, followers: 280, avgViews: 800, capturedAt: older, snapshotDate: older },
      { influencerId: influencerProfileId, platform: Platform.INSTAGRAM, followers: 2000, avgViews: 1300, capturedAt: prevWindow, snapshotDate: prevWindow },
      { influencerId: influencerProfileId, platform: Platform.INSTAGRAM, followers: 2200, avgViews: 1500, capturedAt: recent, snapshotDate: recent },
      { influencerId: influencerProfileId, platform: Platform.TIKTOK, followers: 420, avgViews: 900, capturedAt: recent, snapshotDate: recent },
      { influencerId: influencerProfileId, platform: Platform.INSTAGRAM, followers: 2250, avgViews: 1550, capturedAt: now, snapshotDate: now },
      { influencerId: influencerProfileId, platform: Platform.TIKTOK, followers: 450, avgViews: 920, capturedAt: now, snapshotDate: now },
    ],
  });
}

async function upsertPlatformAccounts(influencerProfileId) {
  await prisma.platformAccount.upsert({
    where: { platform_username: { platform: Platform.INSTAGRAM, username: "mirakaya_demo" } },
    update: { followersSnapshot: 2250, influencerId: influencerProfileId },
    create: {
      influencerId: influencerProfileId,
      platform: Platform.INSTAGRAM,
      username: "mirakaya_demo",
      profileUrl: "https://instagram.com/mirakaya_demo",
      followersSnapshot: 2250,
    },
  });
  await prisma.platformAccount.upsert({
    where: { platform_username: { platform: Platform.TIKTOK, username: "mirakaya_tt" } },
    update: { followersSnapshot: 450, influencerId: influencerProfileId },
    create: {
      influencerId: influencerProfileId,
      platform: Platform.TIKTOK,
      username: "mirakaya_tt",
      profileUrl: "https://tiktok.com/@mirakaya_tt",
      followersSnapshot: 450,
    },
  });
}

async function upsertCampaignData(brandProfileId, influencerProfileId) {
  const campaign = await prisma.campaign.upsert({
    where: { id: "seed-campaign-1" },
    update: {},
    create: {
      id: "seed-campaign-1",
      brandId: brandProfileId,
      title: "Yaz Reels Lansmani",
      campaignType: "Influencer Marketing",
      budgetTotal: 180000,
      budgetSpent: 42000,
      objective: "Bilinirlik",
      status: CampaignStatus.ACTIVE,
      targetPlatforms: "Instagram Reels",
      targetCountry: "TR",
    },
  });

  await prisma.campaignApplication.upsert({
    where: {
      campaignId_influencerId: {
        campaignId: campaign.id,
        influencerId: influencerProfileId,
      },
    },
    update: {},
    create: {
      campaignId: campaign.id,
      influencerId: influencerProfileId,
      offeredPrice: 500,
      note: "Demo basvuru",
      status: ApplicationStatus.PENDING,
    },
  });
}

async function upsertCampaignSetup() {
  const setup = [
    {
      slug: "campaign-type",
      label: "Kampanya Turu",
      sortOrder: 1,
      options: [
        { value: "influencer_marketing", label: "Influencer Marketing", description: "Instagram / TikTok is birlikleri", accent: "from-pink-500 to-rose-500", sortOrder: 1 },
        { value: "free_product", label: "Ucretsiz urun gonderimi", description: "Barter kampanya", accent: "from-emerald-500 to-teal-500", sortOrder: 2 },
        { value: "ugc", label: "UGC kampanya", description: "Kullanici icerigi uretimi", accent: "from-blue-500 to-indigo-500", sortOrder: 3 },
        { value: "location", label: "Lokasyon kampanyasi", description: "Konum bazli gorevler", accent: "from-orange-500 to-amber-500", sortOrder: 4 },
        { value: "paid_product", label: "Ucretli urun gonderimi", description: "Urun + odeme", accent: "from-cyan-500 to-sky-500", sortOrder: 5 },
        { value: "affiliate", label: "Affiliate kampanya", description: "Performansa dayali", accent: "from-orange-600 to-yellow-500", sortOrder: 6 },
      ],
    },
    {
      slug: "campaign-objective",
      label: "Kampanya Hedefi",
      sortOrder: 2,
      options: [
        { value: "awareness", label: "Bilinirlik artirma", description: "Gorunurluk ve erisim", sortOrder: 1 },
        { value: "sales", label: "Satis donusumu", description: "Sepet ve siparis odakli", sortOrder: 2 },
        { value: "engagement", label: "Etkilesim artisi", description: "Yorum / kaydet / paylasim", sortOrder: 3 },
      ],
    },
    {
      slug: "target-platform",
      label: "Platform",
      sortOrder: 3,
      options: [
        { value: "instagram_story", label: "Instagram Story", sortOrder: 1 },
        { value: "instagram_reels", label: "Instagram Reels", sortOrder: 2 },
        { value: "tiktok_video", label: "TikTok Video", sortOrder: 3 },
        { value: "youtube_shorts", label: "YouTube Shorts", sortOrder: 4 },
      ],
    },
    {
      slug: "target-age",
      label: "Yas Araligi",
      sortOrder: 4,
      options: [
        { value: "18-24", label: "18-24", sortOrder: 1 },
        { value: "25-34", label: "25-34", sortOrder: 2 },
        { value: "35-44", label: "35-44", sortOrder: 3 },
        { value: "45-65", label: "45-65", sortOrder: 4 },
      ],
    },
    {
      slug: "target-follower-band",
      label: "Takipci Bandi",
      sortOrder: 5,
      options: [
        { value: "1k-10k", label: "1K - 10K", sortOrder: 1 },
        { value: "10k-50k", label: "10K - 50K", sortOrder: 2 },
        { value: "50k-250k", label: "50K - 250K", sortOrder: 3 },
        { value: "250k+", label: "250K+", sortOrder: 4 },
      ],
    },
  ];

  for (const category of setup) {
    const upserted = await prisma.campaignCategory.upsert({
      where: { slug: category.slug },
      update: {
        label: category.label,
        sortOrder: category.sortOrder,
        isActive: true,
      },
      create: {
        slug: category.slug,
        label: category.label,
        sortOrder: category.sortOrder,
      },
    });

    await prisma.campaignCategoryOption.deleteMany({
      where: { categoryId: upserted.id },
    });

    await prisma.campaignCategoryOption.createMany({
      data: category.options.map((o) => ({
        categoryId: upserted.id,
        value: o.value,
        label: o.label,
        description: o.description ?? null,
        accent: o.accent ?? null,
        sortOrder: o.sortOrder,
        isActive: true,
      })),
    });
  }
}

async function main() {
  const { brandUser, influencerUser } = await upsertUsers();
  await upsertCampaignData(brandUser.brandProfile.id, influencerUser.influencerProfile.id);
  await upsertPlatformAccounts(influencerUser.influencerProfile.id);
  await upsertMetricSnapshots(influencerUser.influencerProfile.id);
  await upsertCampaignSetup();
  console.log("Seed tamamlandi.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
