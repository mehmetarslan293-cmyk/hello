import type { Message, Role } from "@prisma/client";

type Msg = Pick<Message, "senderUserId"> & {
  sender: { role: Role };
};

/** Two-party DM: user is in if they sent a message, or they are the implied counterpart (only one other party has sent). */
export function canAccessDirectThread(messages: Msg[], userId: string, userRole: Role): boolean {
  if (!messages.length) return false;
  const senderIds = [...new Set(messages.map((m) => m.senderUserId))];
  if (senderIds.includes(userId)) return true;
  if (senderIds.length !== 1) return false;
  const onlySenderRole = messages[0].sender.role;
  return onlySenderRole !== userRole;
}
