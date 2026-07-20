"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export interface ProfileUser {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string | null;
  bio?: string | null;
}

interface EditProfileFormProps {
  user: ProfileUser;
  open?: boolean;
  onClose?: () => void;
  inline?: boolean;
}

export function EditProfileForm({ user, open = true, onClose, inline = false }: EditProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [bio, setBio] = useState(user.bio || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(user.name);
    setUsername(user.username);
    setEmail(user.email);
    setAvatar(user.avatar || "");
    setBio(user.bio || "");
    setError("");
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, avatar, bio }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update profile");
        return;
      }
      onClose?.();
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!inline && !open) return null;

  const form = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-4">
        {avatar ? (
          <div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden ring-2 ring-sky-100">
            <Image src={avatar} alt={name} fill className="object-cover" sizes="64px" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white flex items-center justify-center text-xl font-bold shrink-0">
            {name[0] || "?"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <ImageUploadField
            label="Profile photo"
            value={avatar}
            onChange={(url) => setAvatar(url)}
            compact
          />
        </div>
      </div>

      <div>
        <label className="admin-label">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="admin-input"
          required
        />
      </div>

      <div>
        <label className="admin-label">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
          className="admin-input"
          placeholder="admin"
          required
        />
        <p className="text-xs text-gray-400 mt-1">Lowercase letters, numbers, and underscores only</p>
      </div>

      <div>
        <label className="admin-label">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="admin-input"
          required
        />
      </div>

      <div>
        <label className="admin-label">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="admin-input min-h-[88px] resize-y"
          placeholder="Short author bio (optional)"
          rows={3}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        {!inline && onClose && (
          <button type="button" onClick={onClose} className="admin-btn-secondary flex-1">
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`admin-btn-primary ${inline ? "w-full sm:w-auto" : "flex-1"}`}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );

  if (inline) {
    return form;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="admin-card w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
            <p className="text-sm text-gray-500 mt-0.5">Update name, username, photo, and email</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
        {form}
      </div>
    </div>
  );
}
