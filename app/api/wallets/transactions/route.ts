import { NextResponse } from "next/server";
import { FinancialTxnType, Role } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { requireSession } from "@/lib/server/apiAuth";

export async function GET(req: Request) {
  try {
    const { session, response } = await requireSession([Role.BRAND, Role.INFLUENCER]);
    if (!session?.user?.id || response) return response!;

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });
    if (!wallet) {
      return NextResponse.json({ ok: true, transactions: [] });
    }

    const { searchParams } = new URL(req.url);
    const typeParam = searchParams.get("type") as FinancialTxnType | null;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    const transactions = await prisma.financialTransaction.findMany({
      where: {
        walletId: wallet.id,
        type: typeParam ?? undefined,
        createdAt: {
          gte: fromDate && !Number.isNaN(fromDate.getTime()) ? fromDate : undefined,
          lte: toDate && !Number.isNaN(toDate.getTime()) ? toDate : undefined,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({ ok: true, transactions });
  } catch (error) {
    return NextResponse.json({ error: "Islemler alinamadi", detail: String(error) }, { status: 500 });
  }
}
