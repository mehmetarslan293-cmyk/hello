import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";

export type AuthSession = NonNullable<Awaited<ReturnType<typeof auth>>>;

export async function requireSession(allowedRoles?: Role[]) {
  const session = await auth();
  if (!session?.user?.id) {
    return { session: null, response: NextResponse.json({ error: "Oturum gerekli" }, { status: 401 }) };
  }
  if (allowedRoles?.length && !allowedRoles.includes(session.user.role)) {
    return { session: null, response: NextResponse.json({ error: "Yetkisiz" }, { status: 403 }) };
  }
  return { session, response: null };
}

export async function getBrandProfileForUser(userId: string) {
  return prisma.brandProfile.findUnique({
    where: { userId },
    select: { id: true, brandName: true, userId: true },
  });
}

export async function getInfluencerProfileForUser(userId: string) {
  return prisma.influencerProfile.findUnique({
    where: { userId },
    select: { id: true, handle: true, userId: true },
  });
}
