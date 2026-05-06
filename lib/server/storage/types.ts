export type StoredObject = {
  /** Public URL path (e.g. /uploads/deliverables/abc.mp4) or absolute URL for S3/CDN */
  publicUrl: string;
};

export interface VideoStorageProvider {
  putVideo(buffer: Buffer, extension: string): Promise<StoredObject>;
}
