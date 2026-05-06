import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { MessageScope, Role } from "@prisma/client";
import { requireSession } from "@/lib/server/apiAuth";
import { canAccessDirectThread } from "@/lib/server/threadAccess";

async function ensureDemoInfluencerThread() {
  const brandUser = await prisma.user.findFirst({
    where: { email: "brand@example.com" },
    select: { id: true },
  });
  const influencerUser = await prisma.user.findFirst({
    where: { email: "influencer@example.com" },
    select: { id: true, influencerProfile: { select: { handle: true } } },
  });
  if (!brandUser || !influencerUser) return;

  const existing = await prisma.messageThread.findFirst({
    where: {
      scope: MessageScope.DIRECT,
      messages: {
        some: { senderUserId: influencerUser.id },
      },
    },
    select: { id: true },
  });
  if (existing) return;

  await prisma.messageThread.create({
    data: {
      scope: MessageScope.DIRECT,
      title: influencerUser.influencerProfile?.handle ?? "Influencer DM",
      messages: {
        create: [
          {
            senderUserId: influencerUser.id,
            body: "Merhaba! Teklifinizi inceledim, brief detaylarini paylasabilir misiniz?",
          },
          {
            senderUserId: brandUser.id,
            body: "Merhaba, tabii. Bugun brief dokumanini ekliyorum.",
          },
        ],
      },
    },
  });
}

export async function GET(req: Request) {
  try {
    await ensureDemoInfluencerThread();

    const { session, response } = await requireSession([Role.BRAND, Role.INFLUENCER]);
    if (!session?.user?.id || response) return response!;

    const viewerUserId = session.user.id;
    const viewerRole = session.user.role;
    const otherRole: Role = viewerRole === Role.BRAND ? Role.INFLUENCER : Role.BRAND;

    const threads = await prisma.messageThread.findMany({
      where: { scope: MessageScope.DIRECT },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: {
              include: { influencerProfile: true, brandProfile: true },
            },
            reads: { where: { userId: viewerUserId }, select: { id: true } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const accessible = threads.filter((t) =>
      canAccessDirectThread(
        t.messages.map((m) => ({ senderUserId: m.senderUserId, sender: { role: m.sender.role } })),
        viewerUserId,
        viewerRole,
      ),
    );

    let totalUnread = 0;
    const normalized = accessible
      .filter((t) => t.messages.length > 0)
      .map((t) => {
        const last = t.messages[t.messages.length - 1];
        const counterpartMessage = [...t.messages].reverse().find((m) => m.sender.role === otherRole);
        const counterpart =
          counterpartMessage?.sender.influencerProfile?.handle ??
          counterpartMessage?.sender.brandProfile?.brandName ??
          t.messages.find((m) => m.sender.id !== viewerUserId)?.sender.fullName ??
          "Konusma";

        const unreadMessages = t.messages.filter(
          (m) => m.senderUserId !== viewerUserId && m.reads.length === 0,
        );
        const unreadCount = unreadMessages.length;
        totalUnread += unreadCount;

        return {
          id: t.id,
          from: counterpart,
          preview: last.body,
          lastAt: last.createdAt,
          unread: unreadCount > 0,
          unreadCount,
        };
      });

    const { searchParams } = new URL(req.url);
    const threadId = searchParams.get("threadId");
    const activeId = threadId ?? normalized[0]?.id ?? null;
    const activeThread = accessible.find((t) => t.id === activeId) ?? null;

    const messages =
      activeThread?.messages.map((m) => ({
        id: m.id,
        body: m.body,
        createdAt: m.createdAt,
        senderRole: m.sender.role,
        senderName:
          m.sender.role === "INFLUENCER"
            ? m.sender.influencerProfile?.handle ?? m.sender.fullName
            : m.sender.brandProfile?.brandName ?? m.sender.fullName,
      })) ?? [];

    return NextResponse.json({
      ok: true,
      threads: normalized,
      activeThread: activeId,
      messages,
      totalUnread,
    });
  } catch (error) {
    return NextResponse.json({ error: "Mesajlar alinamadi", detail: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { session, response } = await requireSession([Role.BRAND, Role.INFLUENCER]);
    if (!session?.user?.id || response) return response!;

    const body = (await req.json()) as { threadId: string; text: string };
    if (!body.threadId || !body.text?.trim()) {
      return NextResponse.json({ error: "threadId ve text zorunlu" }, { status: 400 });
    }

    const thread = await prisma.messageThread.findUnique({
      where: { id: body.threadId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: { sender: { select: { role: true } } },
        },
      },
    });
    if (!thread) {
      return NextResponse.json({ error: "Konusma bulunamadi" }, { status: 404 });
    }
    if (
      !canAccessDirectThread(
        thread.messages.map((m) => ({ senderUserId: m.senderUserId, sender: { role: m.sender.role } })),
        session.user.id,
        session.user.role,
      )
    ) {
      return NextResponse.json({ error: "Bu konuşmaya erişiminiz yok" }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        threadId: body.threadId,
        senderUserId: session.user.id,
        body: body.text.trim(),
      },
    });

    await prisma.messageThread.update({
      where: { id: body.threadId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ ok: true, message });
  } catch (error) {
    return NextResponse.json({ error: "Mesaj gonderilemedi", detail: String(error) }, { status: 500 });
  }
}

/** Mark all messages from others in the thread as read for the current user. */
export async function PATCH(req: Request) {
  try {
    const { session, response } = await requireSession([Role.BRAND, Role.INFLUENCER]);
    if (!session?.user?.id || response) return response!;

    const body = (await req.json()) as { threadId?: string };
    if (!body.threadId?.trim()) {
      return NextResponse.json({ error: "threadId zorunlu" }, { status: 400 });
    }

    const thread = await prisma.messageThread.findUnique({
      where: { id: body.threadId },
      include: {
        messages: {
          include: { sender: { select: { role: true } } },
        },
      },
    });
    if (!thread) {
      return NextResponse.json({ error: "Konusma bulunamadi" }, { status: 404 });
    }
    if (
      !canAccessDirectThread(
        thread.messages.map((m) => ({ senderUserId: m.senderUserId, sender: { role: m.sender.role } })),
        session.user.id,
        session.user.role,
      )
    ) {
      return NextResponse.json({ error: "Bu konuşmaya erişiminiz yok" }, { status: 403 });
    }

    const toMark = thread.messages.filter((m) => m.senderUserId !== session.user.id).map((m) => m.id);
    if (toMark.length) {
      await prisma.$transaction(
        toMark.map((messageId) =>
          prisma.messageRead.upsert({
            where: { messageId_userId: { messageId, userId: session.user.id } },
            create: { messageId, userId: session.user.id },
            update: { readAt: new Date() },
          }),
        ),
      );
    }

    return NextResponse.json({ ok: true, marked: toMark.length });
  } catch (error) {
    return NextResponse.json({ error: "Okundu isaretlenemedi", detail: String(error) }, { status: 500 });
  }
}
