"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Search, ImageIcon, Loader2, Link2, Film } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  alt: string | null;
  mimeType: string | null;
  fileSize: number | null;
  createdAt: string;
}

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string, media?: MediaItem) => void;
  title?: string;
  mediaFilter?: "all" | "image" | "video";
}

function isVideoMime(mime: string | null | undefined) {
  return !!mime && mime.startsWith("video/");
}

export function MediaPicker({
  open,
  onClose,
  onSelect,
  title = "Choose Image",
  mediaFilter = "image",
}: MediaPickerProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const accept =
    mediaFilter === "video"
      ? "video/mp4,video/webm,video/quicktime"
      : mediaFilter === "image"
        ? "image/jpeg,image/png,image/webp,image/gif,image/avif,image/x-icon"
        : "image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime";

  const fetchMedia = useCallback(async (query = "") => {
    setLoading(true);
    try {
      const params = query ? `?q=${encodeURIComponent(query)}` : "";
      const res = await fetch(`/api/media${params}`);
      if (res.ok) setItems(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      setError("");
      fetchMedia();
    }
  }, [open, fetchMedia]);

  const filtered = items.filter((item) => {
    if (mediaFilter === "video") return isVideoMime(item.mimeType);
    if (mediaFilter === "image") return !isVideoMime(item.mimeType);
    return true;
  });

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/media", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }
      setItems((prev) => [data, ...prev]);
      onSelect(data.url, data);
      onClose();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) uploadFile(file);
  };

  const handleUrlSubmit = () => {
    const url = urlInput.trim();
    if (!url) return;
    onSelect(url);
    onClose();
  };

  if (!open) return null;

  const uploadHint =
    mediaFilter === "video"
      ? "MP4, WebM, MOV · Max 50 MB"
      : mediaFilter === "all"
        ? "Images & videos"
        : "JPG, PNG, WebP, GIF · Max 10 MB";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="admin-card w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-fade-up">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
              dragOver ? "border-sky-400 bg-sky-50" : "border-gray-200 hover:border-sky-300 hover:bg-gray-50"
            )}
          >
            <input
              ref={fileRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
                <p className="text-sm font-medium">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-sky-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Drag & drop here, or <span className="text-sky-600">choose file</span>
                </p>
                <p className="text-xs text-gray-400">{uploadHint}</p>
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="admin-search-field">
            <Search className="admin-search-icon" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                fetchMedia(e.target.value);
              }}
              placeholder="Search media library..."
              className="admin-search-input"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item.url, item);
                    onClose();
                  }}
                  className="group relative aspect-square rounded-full overflow-hidden border-2 border-gray-200 hover:border-sky-400 hover:ring-2 hover:ring-sky-200 transition-all"
                >
                  {isVideoMime(item.mimeType) ? (
                    <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                      <Film className="w-8 h-8 text-white/80" />
                    </div>
                  ) : (
                    <Image src={item.url} alt={item.alt || item.filename} fill className="object-cover" unoptimized={item.url.startsWith("/uploads")} />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-full" />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No media yet. Upload your first file above.</p>
            </div>
          )}

          {mediaFilter !== "video" && (
            <div className="border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setShowUrl(!showUrl)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
              >
                <Link2 className="w-4 h-4" />
                {showUrl ? "Hide URL option" : "Or paste URL"}
              </button>
              {showUrl && (
                <div className="flex gap-2 mt-3">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://..."
                    className="admin-input flex-1"
                  />
                  <button type="button" onClick={handleUrlSubmit} className="admin-btn-secondary shrink-0">
                    Use URL
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
