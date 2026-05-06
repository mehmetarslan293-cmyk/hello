export type InfluencerTask = {
  id: string;
  title: string;
  brand: string;
  reward: number;
  status: "Yeni" | "Onaylandi" | "Revize";
  due: string;
};

export const influencerTasks: InfluencerTask[] = [
  { id: "t1", title: "Pegasus Instagram Calismasi", brand: "Pegasus", reward: 500, status: "Yeni", due: "3 gun" },
  { id: "t2", title: "Kozmetik Markasi Instagram", brand: "Glow Cosmetics", reward: 500, status: "Revize", due: "3 gun" },
  { id: "t3", title: "Hepsiburada Kampanya", brand: "Hepsiburada", reward: 500, status: "Onaylandi", due: "3 gun" },
  { id: "t4", title: "Nike yeni sezon SS'24", brand: "Nike", reward: 500, status: "Yeni", due: "4 gun" },
];

export const trendVideos = [
  { id: "v1", handle: "@filizkumpir", score: 95, hook: "Statement", views: "18.1M", likes: "1.0M", er: "5.8%" },
  { id: "v2", handle: "@urfagurmee", score: 95, hook: "Curiosity", views: "28.6M", likes: "975K", er: "3.4%" },
  { id: "v3", handle: "@betulsedas", score: 95, hook: "Statement", views: "5.5M", likes: "312K", er: "3.0%" },
  { id: "v4", handle: "@foodieholly", score: 90, hook: "Curiosity", views: "4.1M", likes: "220K", er: "4.8%" },
];

export const balanceRows = [
  { id: "b1", brand: "Hepsiburada", amount: 500 },
  { id: "b2", brand: "Kozmetik Markasi", amount: 2500 },
  { id: "b3", brand: "Nike", amount: 300 },
];

export const profileStats = [
  { title: "Takipci", value: "2334" },
  { title: "Takip Edilen", value: "345" },
  { title: "Etkilesim", value: "%93" },
];
