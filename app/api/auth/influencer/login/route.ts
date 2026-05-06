import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { verifyPassword } from "@/lib/server/auth";
import { Role } from "@prisma/client";

type Body = {
  email: string;
  password: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    if (!body.email || !body.password) {
      return NextResponse.json({ error: "E-posta ve şifre zorunlu" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
      include: { influencerProfile: true },
    });

    if (!user || user.role !== Role.INFLUENCER || !verifyPassword(body.password, user.passwordHash)) {
      return NextResponse.json({ error: "Geçersiz kimlik bilgisi" }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        handle: user.influencerProfile?.handle ?? null,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Giriş işlemi başarısız", detail: String(error) }, { status: 500 });
  }
}
