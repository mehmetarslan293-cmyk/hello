import { createHash } from "node:crypto";

export function hashPassword(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}

export function verifyPassword(raw: string, hash: string) {
  return hashPassword(raw) === hash;
}
