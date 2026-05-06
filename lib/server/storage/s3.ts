import type { VideoStorageProvider } from "./types";
import { randomBytes } from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export class S3VideoStorage implements VideoStorageProvider {
  async putVideo(buffer: Buffer, extension: string): Promise<{ publicUrl: string }> {
    const bucket = process.env.S3_BUCKET;
    const region = process.env.S3_REGION;
    const accessKeyId = process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
    if (!bucket || !region || !accessKeyId || !secretAccessKey) {
      throw new Error("S3 ayarlari eksik: S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY");
    }

    const safeExt = extension.startsWith(".") ? extension : `.${extension}`;
    const key = `deliverables/${Date.now()}-${randomBytes(8).toString("hex")}${safeExt}`;

    const client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentTypeForExtension(safeExt),
      }),
    );

    const customBaseUrl = process.env.S3_PUBLIC_BASE_URL?.replace(/\/$/, "");
    const publicUrl = customBaseUrl ? `${customBaseUrl}/${key}` : `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    return { publicUrl };
  }
}

function contentTypeForExtension(ext: string) {
  if (ext === ".mp4") return "video/mp4";
  if (ext === ".mov") return "video/quicktime";
  if (ext === ".webm") return "video/webm";
  return "application/octet-stream";
}
