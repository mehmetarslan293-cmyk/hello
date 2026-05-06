import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { ApplicationStatus, Role } from "@prisma/client";
import { getBrandProfileForUser, getInfluencerProfileForUser, requireSession } from "@/lib/server/apiAuth";

type Body = {
  campaignId: string;
  influencerId: string;
  offeredPrice?: number;
  note?: string;
};

export async function GET(req: Request) {
  const { session, response } = await requireSession([Role.BRAND, Role.INFLUENCER]);
  if (!session?.user?.id || response) return response!;

  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("campaignId");
  const influencerIdParam = searchParams.get("influencerId");

  if (session.user.role === Role.BRAND) {
    const brand = await getBrandProfileForUser(session.user.id);
    if (!brand) return NextResponse.json({ ok: true, applications: [] });
    if (campaignId) {
      const camp = await prisma.campaign.findFirst({
        where: { id: campaignId, brandId: brand.id },
        select: { id: true },
      });
      if (!camp) {
        return NextResponse.json({ error: "Kampanya bulunamadi" }, { status: 404 });
      }
    }
    const applications = await prisma.campaignApplication.findMany({
      where: {
        campaignId: campaignId ?? undefined,
        campaign: { brandId: brand.id },
      },
      include: { campaign: true, influencer: true },
      orderBy: { appliedAt: "desc" },
    });
    return NextResponse.json({ ok: true, applications });
  }

  const inf = await getInfluencerProfileForUser(session.user.id);
  if (!inf) return NextResponse.json({ ok: true, applications: [] });
  if (influencerIdParam && influencerIdParam !== inf.id) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const applications = await prisma.campaignApplication.findMany({
    where: {
      influencerId: inf.id,
      campaignId: campaignId ?? undefined,
    },
    include: { campaign: true, influencer: true },
    orderBy: { appliedAt: "desc" },
  });

  return NextResponse.json({ ok: true, applications });
}

export async function POST(req: Request) {
  try {
    const { session, response } = await requireSession([Role.INFLUENCER]);
    if (!session?.user?.id || response) return response!;

    const inf = await getInfluencerProfileForUser(session.user.id);
    if (!inf) {
      return NextResponse.json({ error: "Influencer profili bulunamadi" }, { status: 400 });
    }

    const body = (await req.json()) as Body;
    if (!body.campaignId || !body.influencerId) {
      return NextResponse.json({ error: "campaignId ve influencerId zorunlu" }, { status: 400 });
    }
    if (body.influencerId !== inf.id) {
      return NextResponse.json({ error: "Influencer kimligi oturum ile eslesmiyor" }, { status: 403 });
    }

    const application = await prisma.campaignApplication.upsert({
      where: {
        campaignId_influencerId: {
          campaignId: body.campaignId,
          influencerId: body.influencerId,
        },
      },
      update: {
        offeredPrice: body.offeredPrice ?? 0,
        note: body.note,
        status: ApplicationStatus.PENDING,
      },
      create: {
        campaignId: body.campaignId,
        influencerId: body.influencerId,
        offeredPrice: body.offeredPrice ?? 0,
        note: body.note,
      },
    });

    return NextResponse.json({ ok: true, application });
  } catch (error) {
    return NextResponse.json({ error: "Başvuru kaydedilemedi", detail: String(error) }, { status: 500 });
  }
}
