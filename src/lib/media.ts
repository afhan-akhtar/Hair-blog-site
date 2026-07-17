import path from "path";

export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/x-icon",
  "image/vnd.microsoft.icon",
]);

export const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50 MB

export function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}

export function getUploadPaths(originalName: string) {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const ext = path.extname(originalName).toLowerCase() || ".jpg";
  const base = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const filename = `${base}${ext}`;
  const relativeDir = path.posix.join("uploads", year, month);
  const relativePath = `/${relativePathJoin(relativeDir, filename)}`;
  const absoluteDir = path.join(process.cwd(), "public", relativeDir);
  const absolutePath = path.join(absoluteDir, filename);

  return { relativeDir, relativePath, absoluteDir, absolutePath, filename };
}

function relativePathJoin(...parts: string[]) {
  return parts.join("/");
}

export function isVideoMime(mime: string | null | undefined) {
  return !!mime && ALLOWED_VIDEO_TYPES.has(mime);
}

export function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Only JPG, PNG, WebP, GIF, AVIF, and ICO images are allowed";
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return "Image must be smaller than 10 MB";
  }
  return null;
}

export function validateMediaFile(file: File) {
  const isImage = ALLOWED_IMAGE_TYPES.has(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.has(file.type);

  if (!isImage && !isVideo) {
    return "Only images (JPG, PNG, WebP, GIF) and videos (MP4, WebM, MOV) are allowed";
  }

  const maxSize = isVideo ? MAX_VIDEO_BYTES : MAX_UPLOAD_BYTES;
  if (file.size > maxSize) {
    return isVideo ? "Video must be smaller than 50 MB" : "Image must be smaller than 10 MB";
  }

  return null;
}
