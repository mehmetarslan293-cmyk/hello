import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { FinancialTxnType, Role } from "@prisma/client";
import { requireSession } from "@/lib/server/apiAuth";

type Body = {
  amount: number;
  iban: string;
  note?: string;
};

export async function POST(req: Request) {
  try {
    const { session, response } = await requireSession([Role.BRAND, Role.INFLUENCER]);
    if (!session?.user?.id || response) return response!;

    const body = (await req.json()) as Body;
    if (!body.amount || !body.iban) {
      return NextResponse.json({ error: "Eksik alanlar" }, { status: 400 });
    }
    if (body.amount < 40) {
      return NextResponse.json({ error: "Minimum çekim tutarı 40 TRY" }, { status: 400 });
    }

    const wallet = await prisma.wallet.findUnique({ where: { userId: session.user.id } });
    if (!wallet) return NextResponse.json({ error: "Cüzdan bulunamadı" }, { status: 404 });
    if (wallet.balance < body.amount) {
      return NextResponse.json({ error: "Yetersiz bakiye" }, { status: 400 });
    }

    const balanceAfter = wallet.balance - body.amount;

    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: balanceAfter },
      }),
      prisma.financialTransaction.create({
        data: {
          walletId: wallet.id,
          type: FinancialTxnType.WITHDRAWAL_REQUEST,
          amount: -body.amount,
          balanceAfter,
          note: `IBAN: ${body.iban}${body.note ? ` | ${body.note}` : ""}`,
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      message: "Para çekim talebi oluşturuldu",
      balanceAfter,
    });
  } catch (error) {
    return NextResponse.json({ error: "Çekim talebi oluşturulamadı", detail: String(error) }, { status: 500 });
  }
}
