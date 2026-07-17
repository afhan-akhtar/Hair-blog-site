"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, FolderOpen, X, Loader2, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaPicker, type MediaItem } from "./MediaPicker";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string, media?: MediaItem) => void;
  label?: string;
  compact?: boolean;
  className?: string;
  accept?: string;
}

export function ImageUploadField({
  value,
  onChange,
  label,
  compact = false,
  className,
  accept = "image/jpeg,image/png,image/webp,image/gif,image/avif",
}: ImageUploadFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

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
      onChange(data.url, data);
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

  return (
    <div className={cn("space-y-2", className)}>
      {label && <p className="admin-label !mb-0">{label}</p>}

      {value ? (
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
          <div className={cn("relative w-full", compact ? "h-28" : "h-36")}>
            <Image src={value} alt="" fill className="object-cover" unoptimized={value.startsWith("/uploads")} />
          </div>
          <div className="flex flex-wrap gap-2 p-2.5 bg-white border-t border-gray-100">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="admin-btn-secondary !py-1.5 !px-3 text-xs"
            >
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Replace"}
            </button>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="admin-btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1"
            >
              <FolderOpen className="w-3.5 h-3.5" /> Library
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="admin-btn-secondary !py-1.5 !px-3 text-xs text-red-600 hover:bg-red-50"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl transition-all",
            compact ? "p-4" : "p-5",
            uploading ? "border-sky-300 bg-sky-50" : "border-gray-200 hover:border-sky-300 hover:bg-gray-50"
          )}
        >
          {uploading ? (
            <div className="flex items-center justify-center gap-2 py-4 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
              <span className="text-sm">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
                <Upload className="w-5 h-5 text-sky-600" />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="admin-btn-primary !py-2 !px-4 text-sm"
                >
                  Choose file
                </button>
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="admin-btn-secondary !py-2 !px-4 text-sm flex items-center gap-1.5"
                >
                  <FolderOpen className="w-4 h-4" /> Media library
                </button>
              </div>
              <p className="text-xs text-gray-400">JPG, PNG, WebP, GIF · Max 10 MB</p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
      )}

      <button
        type="button"
        onClick={() => setShowUrl(!showUrl)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600"
      >
        <Link2 className="w-3.5 h-3.5" />
        {showUrl ? "Hide URL paste" : "Or paste image URL"}
      </button>
      {showUrl && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://..."
            className="admin-input flex-1 !py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => {
              if (urlInput.trim()) onChange(urlInput.trim());
            }}
            className="admin-btn-secondary shrink-0 !py-2 text-sm"
          >
            Use
          </button>
        </div>
      )}

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url, media) => onChange(url, media)}
        title="Choose Image"
      />
    </div>
  );
}
