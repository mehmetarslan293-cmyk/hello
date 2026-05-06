const maxMbRaw = Number(process.env.DELIVERABLE_MAX_UPLOAD_MB ?? 50);
const maxMb = Number.isFinite(maxMbRaw) && maxMbRaw > 0 ? maxMbRaw : 50;
const MAX_BYTES = maxMb * 1024 * 1024;

const MIME_TO_EXT: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/quicktime": ".mov",
  "video/webm": ".webm",
};

const ALLOWED_EXT = new Set([".mp4", ".mov", ".webm"]);

export function assertAllowedVideoUpload(file: File) {
  if (!(file instanceof File) || file.size <= 0) {
    throw new Error("Gecerli bir video dosyasi secin");
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`Dosya boyutu ${Math.round(MAX_BYTES / 1024 / 1024)}MB sinirini asiyor`);
  }
  const mime = (file.type || "").toLowerCase();
  const nameExt = file.name ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase() : "";
  const extFromMime = MIME_TO_EXT[mime];
  const ext = extFromMime ?? (ALLOWED_EXT.has(nameExt) ? nameExt : null);
  if (!ext || !ALLOWED_EXT.has(ext)) {
    throw new Error("Sadece mp4, mov veya webm formatlari kabul edilir");
  }
  return ext;
}

export async function readVideoFileBuffer(file: File): Promise<{ buffer: Buffer; extension: string }> {
  const extension = assertAllowedVideoUpload(file);
  const arrayBuffer = await file.arrayBuffer();
  return { buffer: Buffer.from(arrayBuffer), extension };
}
