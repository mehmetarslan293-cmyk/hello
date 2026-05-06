import { NextResponse } from "next/server";
import { ApplicationStatus, DeliverableStatus, Role } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { getInfluencerProfileForUser, requireSession } from "@/lib/server/apiAuth";
import { getVideoStorage } from "@/lib/server/storage";
import { readVideoFileBuffer } from "@/lib/server/deliverableUpload";

export async function GET(req: Request) {
  try {
    const { session, response } = await requireSession([Role.INFLUENCER]);
    if (!session?.user?.id || response) return response!;

    const influencer = await getInfluencerProfileForUser(session.user.id);
    if (!influencer) {
      return NextResponse.json({ ok: true, deliverables: [], campaigns: [] });
    }
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get("campaignId");

    const [deliverables, applications] = await Promise.all([
      prisma.deliverable.findMany({
        where: {
          influencerId: influencer.id,
          campaignId: campaignId ?? undefined,
        },
        include: { campaign: { select: { id: true, title: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.campaignApplication.findMany({
        where: {
          influencerId: influencer.id,
          status: ApplicationStatus.ACCEPTED,
        },
        include: { campaign: { select: { id: true, title: true } } },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    const campaigns = Array.from(
      new Map(applications.map((a) => [a.campaign.id, { id: a.campaign.id, title: a.campaign.title }])).values(),
    );
    const selectedCampaign = campaignId ? campaigns.find((c) => c.id === campaignId) ?? null : null;
    return NextResponse.json({ ok: true, deliverables, campaigns, selectedCampaign });
  } catch (error) {
    return NextResponse.json({ error: "Icerikler alinamadi", detail: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { session, response } = await requireSession([Role.INFLUENCER]);
    if (!session?.user?.id || response) return response!;

    const influencer = await getInfluencerProfileForUser(session.user.id);
    if (!influencer) {
      return NextResponse.json({ error: "Influencer profili bulunamadi" }, { status: 400 });
    }

    const form = await req.formData();
    const campaignId = String(form.get("campaignId") ?? "").trim();
    const caption = String(form.get("caption") ?? "").trim();
    const directUrl = String(form.get("contentUrl") ?? "").trim();
    const file = form.get("video");

    if (!campaignId) {
      return NextResponse.json({ error: "Kampanya secimi zorunlu" }, { status: 400 });
    }

    const acceptedApplication = await prisma.campaignApplication.findFirst({
      where: {
        campaignId,
        influencerId: influencer.id,
        status: ApplicationStatus.ACCEPTED,
      },
      select: { id: true },
    });
    if (!acceptedApplication) {
      return NextResponse.json({ error: "Bu kampanya icin once teklif kabul edilmeli" }, { status: 400 });
    }

    let contentUrl: string | null = directUrl || null;

    if (file instanceof File && file.size > 0) {
      try {
        const { buffer, extension } = await readVideoFileBuffer(file);
        const storage = getVideoStorage();
        const stored = await storage.putVideo(buffer, extension);
        contentUrl = stored.publicUrl;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Video yuklenemedi";
        return NextResponse.json({ error: msg }, { status: 400 });
      }
    }

    if (!contentUrl) {
      return NextResponse.json({ error: "Video yukleyin veya icerik baglantisi girin" }, { status: 400 });
    }

    const created = await prisma.deliverable.create({
      data: {
        campaignId,
        influencerId: influencer.id,
        title: `Icerik Teslimi ${new Date().toLocaleDateString("tr-TR")}`,
        caption: caption || null,
        contentUrl,
        submittedAt: new Date(),
        status: DeliverableStatus.SUBMITTED,
      },
    });

    return NextResponse.json({ ok: true, deliverable: created });
  } catch (error) {
    return NextResponse.json({ error: "Icerik gonderilemedi", detail: String(error) }, { status: 500 });
  }
}
