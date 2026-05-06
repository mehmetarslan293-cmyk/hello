import type { VideoStorageProvider } from "./types";
import { LocalVideoStorage } from "./local";
import { S3VideoStorage } from "./s3";

export function getVideoStorage(): VideoStorageProvider {
  const driver = (process.env.STORAGE_DRIVER ?? "local").toLowerCase();
  if (driver === "s3") {
    return new S3VideoStorage();
  }
  return new LocalVideoStorage();
}

export type { VideoStorageProvider, StoredObject } from "./types";
