"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload, Search, Loader2, ImageIcon, Film } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  alt: string | null;
  mimeType: string | null;
  fileSize: number | null;
  createdAt: string;
}

interface MediaLibraryProps {
  initialMedia: MediaItem[];
}

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isVideoMime(mime: string | null | undefined) {
  return !!mime && mime.startsWith("video/");
}

export function MediaLibrary({ initialMedia }: MediaLibraryProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialMedia);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");

    try {
      const uploaded: MediaItem[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/media", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || `Failed to upload ${file.name}`);
          continue;
        }
        uploaded.push(data);
      }
      if (uploaded.length) {
        setItems((prev) => [...uploaded, ...prev]);
        router.refresh();
      }
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const filtered = items.filter(
    (item) =>
      !search ||
      item.filename.toLowerCase().includes(search.toLowerCase()) ||
      item.alt?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          uploadFiles(e.dataTransfer.files);
        }}
        className={cn(
          "admin-card p-6 mb-6 border-2 border-dashed transition-all cursor-pointer",
          dragOver ? "border-sky-400 bg-sky-50" : "border-gray-200 hover:border-sky-300 hover:bg-gray-50"
        )}
        onClick={() => !uploading && fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime"
          multiple
          className="hidden"
          onChange={(e) => uploadFiles(e.target.files)}
        />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
              <p className="text-sm font-medium text-gray-600">Uploading files...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
                <Upload className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Drop files here or click to upload</p>
                <p className="text-sm text-gray-500 mt-0.5">Images (10 MB) · Videos MP4/WebM/MOV (50 MB)</p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4">{error}</p>
      )}

      <div className="admin-search-field mb-4">
        <Search className="admin-search-icon" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by filename or alt text..."
          className="admin-search-input"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="admin-card overflow-hidden group hover:shadow-md transition-shadow p-3">
              <div className="relative aspect-square rounded-full overflow-hidden ring-2 ring-gray-100 mx-auto w-full max-w-[120px]">
                {isVideoMime(item.mimeType) ? (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <Film className="w-8 h-8 text-white/70" />
                  </div>
                ) : (
                  <Image
                    src={item.url}
                    alt={item.alt || item.filename}
                    fill
                    className="object-cover"
                    unoptimized={item.url.startsWith("/uploads")}
                  />
                )}
              </div>
              <div className="p-2 text-center mt-2">
                <p className="text-xs font-medium truncate text-gray-700">{item.filename}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{formatSize(item.fileSize)}</p>
                {!item.alt && !isVideoMime(item.mimeType) && (
                  <p className="text-[10px] text-amber-600 mt-1">Missing alt text</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-card p-16 text-center">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {search ? "No files match your search." : "No media uploaded yet."}
          </p>
        </div>
      )}
    </div>
  );
}
