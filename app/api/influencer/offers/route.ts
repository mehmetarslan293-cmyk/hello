import { NextResponse } from "next/server";
import { ApplicationStatus, CampaignStatus, Role } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { getInfluencerProfileForUser, requireSession } from "@/lib/server/apiAuth";

function readDetail(description: string | null | undefined, key: string) {
  if (!description) return "-";
  const line = description.split("\n").find((x) => x.startsWith(`${key}:`));
  return line ? line.slice(key.length + 1).trim() : "-";
}

function fallbackCargoStatus(campaignStatus: CampaignStatus) {
  if (campaignStatus === CampaignStatus.COMPLETED) return "Teslim edildi";
  if (campaignStatus === CampaignStatus.ACTIVE) return "Kargoya verildi";
  if (campaignStatus === CampaignStatus.CANCELLED) return "Iptal edildi";
  return "Kargo bekleniyor";
}

export async function GET() {
  try {
    const { session, response } = await requireSession([Role.INFLUENCER]);
    if (!session?.user?.id || response) return response!;

    const influencer = await getInfluencerProfileForUser(session.user.id);
    if (!influencer) {
      return NextResponse.json({ ok: true, offers: [] });
    }

    const applications = await prisma.campaignApplication.findMany({
      where: { influencerId: influencer.id },
      include: {
        campaign: {
          select: {
            id: true,
            title: true,
            campaignType: true,
            description: true,
            status: true,
            brand: {
              select: {
                brandName: true,
              },
            },
          },
        },
      },
      orderBy: { appliedAt: "desc" },
    });

    const offers = applications.map((app) => {
      const descriptionCargo = readDetail(app.campaign.description, "CARGO_STATUS");
      const descriptionOfferType = readDetail(app.campaign.description, "OFFER_TYPE");
      return {
        id: app.id,
        campaignId: app.campaignId,
        campaign: app.campaign.title,
        brand: app.campaign.brand.brandName,
        offerType: descriptionOfferType !== "-" ? descriptionOfferType : app.campaign.campaignType,
        reward: app.offeredPrice,
        shippingStatus: descriptionCargo !== "-" ? descriptionCargo : fallbackCargoStatus(app.campaign.status),
        offerStatus: app.status,
      };
    });

    return NextResponse.json({ ok: true, offers });
  } catch (error) {
    return NextResponse.json({ error: "Teklifler alinamadi", detail: String(error) }, { status: 500 });
  }
}

type PatchBody = {
  applicationId?: string;
  action?: "accept" | "reject";
};

export async function PATCH(req: Request) {
  try {
    const { session, response } = await requireSession([Role.INFLUENCER]);
    if (!session?.user?.id || response) return response!;

    const inf = await getInfluencerProfileForUser(session.user.id);
    if (!inf) {
      return NextResponse.json({ error: "Influencer profili bulunamadi" }, { status: 400 });
    }

    const body = (await req.json()) as PatchBody;
    if (!body.applicationId || !body.action) {
      return NextResponse.json({ error: "applicationId ve action zorunlu" }, { status: 400 });
    }

    const existing = await prisma.campaignApplication.findFirst({
      where: { id: body.applicationId, influencerId: inf.id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Basvuru bulunamadi" }, { status: 404 });
    }

    const status = body.action === "accept" ? ApplicationStatus.ACCEPTED : ApplicationStatus.REJECTED;

    const updated = await prisma.campaignApplication.update({
      where: { id: body.applicationId },
      data: { status },
      select: { id: true, status: true },
    });

    return NextResponse.json({ ok: true, application: updated });
  } catch (error) {
    return NextResponse.json({ error: "Teklif durumu guncellenemedi", detail: String(error) }, { status: 500 });
  }
}
