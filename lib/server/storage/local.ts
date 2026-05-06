import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import type { VideoStorageProvider } from "./types";

export class LocalVideoStorage implements VideoStorageProvider {
  async putVideo(buffer: Buffer, extension: string): Promise<{ publicUrl: string }> {
    const uploadDir = path.join(process.cwd(), "public", "uploads", "deliverables");
    await fs.mkdir(uploadDir, { recursive: true });
    const safeExt = extension.startsWith(".") ? extension : `.${extension}`;
    const fileName = `${Date.now()}-${randomBytes(8).toString("hex")}${safeExt}`;
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);
    return { publicUrl: `/uploads/deliverables/${fileName}` };
  }
}
