import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { hashPassword } from "@/lib/server/auth";
import { Role } from "@prisma/client";

type Body = {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  title?: string;
  country?: string;
  brandName: string;
  website?: string;
  companyType?: string;
  sector?: string;
  referralSource?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    if (!body.email || !body.password || !body.fullName || !body.brandName) {
      return NextResponse.json({ error: "Eksik alanlar" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return NextResponse.json({ error: "Bu e-posta zaten kayıtlı" }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        passwordHash: hashPassword(body.password),
        fullName: body.fullName,
        phone: body.phone,
        role: Role.BRAND,
        brandProfile: {
          create: {
            brandName: body.brandName,
            website: body.website,
            companyType: body.companyType,
            sector: body.sector,
            title: body.title,
            country: body.country,
            referralSource: body.referralSource,
          },
        },
      },
      include: { brandProfile: true },
    });

    await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: 0,
        escrowBalance: 0,
      },
    });

    return NextResponse.json({
      ok: true,
      userId: user.id,
      role: user.role,
    });
  } catch (error) {
    return NextResponse.json({ error: "Kayıt işlemi başarısız", detail: String(error) }, { status: 500 });
  }
}
