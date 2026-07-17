"use client";

import { useRef, useState } from "react";
import { Upload, FolderOpen, X, Loader2, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaPicker, type MediaItem } from "./MediaPicker";

interface VideoUploadFieldProps {
  value: string;
  onChange: (url: string, media?: MediaItem) => void;
  label?: string;
  className?: string;
}

export function VideoUploadField({ value, onChange, label, className }: VideoUploadFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
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
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <p className="admin-label !mb-0">{label}</p>}

      {value ? (
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-900">
          <video src={value} controls className="w-full max-h-48" />
          <div className="flex gap-2 p-2.5 bg-white border-t border-gray-100">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="admin-btn-secondary !py-1.5 !px-3 text-xs"
            >
              Replace
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
              className="admin-btn-secondary !py-1.5 !px-3 text-xs text-red-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-5 text-center transition-all",
            uploading ? "border-violet-300 bg-violet-50" : "border-gray-200 hover:border-violet-300 hover:bg-gray-50"
          )}
        >
          {uploading ? (
            <div className="flex items-center justify-center gap-2 py-3 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
              <span className="text-sm">Uploading video...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center">
                <Film className="w-5 h-5 text-violet-600" />
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="admin-btn-primary !py-2 !px-4 text-sm flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" /> Choose video
                </button>
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="admin-btn-secondary !py-2 !px-4 text-sm"
                >
                  Media library
                </button>
              </div>
              <p className="text-xs text-gray-400">MP4, WebM, MOV · Max 50 MB</p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file);
        }}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url, media) => onChange(url, media)}
        title="Choose Video"
        mediaFilter="video"
      />
    </div>
  );
}
