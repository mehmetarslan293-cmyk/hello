import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";

export async function GET() {
  try {
    const categories = await prisma.campaignCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        options: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return NextResponse.json({
      ok: true,
      categories,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Kampanya kurulum verileri alinamadi", detail: String(error) },
      { status: 500 },
    );
  }
}
