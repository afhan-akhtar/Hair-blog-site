"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, FolderOpen, X } from "lucide-react";
import { MediaPicker } from "@/components/admin/MediaPicker";

interface ImageSourceFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  previewHeight?: string;
}

export function ImageSourceField({
  value,
  onChange,
  label = "Image",
  previewHeight = "h-36",
}: ImageSourceFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="space-y-3">
      {label && <label className="admin-label">{label}</label>}

      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 group">
          <div className={`relative w-full ${previewHeight}`}>
            <Image src={value} alt="" fill className="object-cover" />
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            title="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center">
          <ImagePlus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-3">No image selected</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="admin-btn-primary flex items-center gap-2 text-sm py-2"
        >
          <ImagePlus className="w-4 h-4" />
          {value ? "Change Image" : "Upload / Choose"}
        </button>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="admin-btn-secondary flex items-center gap-2 text-sm py-2"
        >
          <FolderOpen className="w-4 h-4" />
          Media Library
        </button>
      </div>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => onChange(url)}
        title={label}
      />
    </div>
  );
}
