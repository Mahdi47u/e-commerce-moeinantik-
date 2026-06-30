export type MediaAsset = {
  id: number;
  createdAt: string;
  fileName: string;
  originalFileName: string;
  contentType: string;
  sizeBytes: number;
  objectKey: string;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};
