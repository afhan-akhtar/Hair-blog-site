"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { VideoUploadField } from "@/components/admin/VideoUploadField";
import { Save, Globe, Palette, CheckCircle2 } from "lucide-react";
import type { SiteSettings } from "@/lib/site-settings";

interface SiteSettingsFormProps {
  initial: SiteSettings;
}

export function SiteSettingsForm({ initial }: SiteSettingsFormProps) {
  const router = useRouter();
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (key: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save settings");
        return;
      }
      setSettings(data);
      setSuccess(true);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="admin-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Site Branding</h2>
            <p className="text-sm text-gray-500">Logo, favicon & video — shown on the public site</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="admin-label">Site Title</label>
              <input
                type="text"
                value={settings.site_title}
                onChange={(e) => update("site_title", e.target.value)}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Tagline</label>
              <input
                type="text"
                value={settings.site_tagline}
                onChange={(e) => update("site_tagline", e.target.value)}
                className="admin-input"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Site Description</label>
            <textarea
              value={settings.site_description}
              onChange={(e) => update("site_description", e.target.value)}
              rows={3}
              className="admin-input resize-none"
            />
          </div>

          <ImageUploadField
            label="Site Logo"
            value={settings.site_logo}
            onChange={(url) => update("site_logo", url)}
            compact
          />

          <ImageUploadField
            label="Favicon"
            value={settings.site_favicon}
            onChange={(url) => update("site_favicon", url)}
            compact
            accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/jpeg,image/webp"
          />

          <VideoUploadField
            label="Hero / Promo Video"
            value={settings.hero_video}
            onChange={(url) => update("hero_video", url)}
          />
        </div>
      </div>

      <div className="admin-card p-6">
        <h2 className="font-semibold text-gray-900 mb-1">Footer Copyright</h2>
        <p className="text-sm text-gray-500 mb-4">
          Use <code className="text-xs bg-gray-100 px-1 rounded">{"{year}"}</code> and{" "}
          <code className="text-xs bg-gray-100 px-1 rounded">{"{site}"}</code> as placeholders
        </p>
        <input
          type="text"
          value={settings.copyright_text}
          onChange={(e) => update("copyright_text", e.target.value)}
          className="admin-input"
          placeholder="© {year} {site}. All rights reserved."
        />
        <div className="mt-4">
          <label className="admin-label">Site name link (in copyright)</label>
          <input
            type="text"
            value={settings.copyright_link}
            onChange={(e) => update("copyright_link", e.target.value)}
            className="admin-input"
            placeholder="/"
          />
          <p className="text-xs text-gray-400 mt-1">Where the site name links when clicked in copyright</p>
        </div>
      </div>

      <div className="admin-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">SEO & Social</h2>
            <p className="text-sm text-gray-500">Analytics and social profile links</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="admin-label">Google Analytics ID</label>
            <input
              type="text"
              value={settings.google_analytics}
              onChange={(e) => update("google_analytics", e.target.value)}
              className="admin-input"
              placeholder="G-XXXXXXXXXX"
            />
          </div>
          <div>
            <label className="admin-label">Instagram</label>
            <input
              type="url"
              value={settings.social_instagram}
              onChange={(e) => update("social_instagram", e.target.value)}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Pinterest</label>
            <input
              type="url"
              value={settings.social_pinterest}
              onChange={(e) => update("social_pinterest", e.target.value)}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">TikTok</label>
            <input
              type="url"
              value={settings.social_tiktok}
              onChange={(e) => update("social_tiktok", e.target.value)}
              className="admin-input"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          Settings saved — changes will appear on the public site
        </div>
      )}

      <button onClick={handleSave} disabled={saving} className="admin-btn-primary flex items-center gap-2">
        <Save className="w-4 h-4" />
        {saving ? "Saving..." : "Save Site Settings"}
      </button>
    </div>
  );
}
