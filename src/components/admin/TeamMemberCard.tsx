"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Shield, Trash2 } from "lucide-react";
import { EditProfileForm } from "@/components/admin/EditProfileForm";

interface TeamMemberCardProps {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    role: string;
    avatar: string | null;
    bio: string | null;
    _count: { posts: number };
  };
  roleLabel: string;
  currentUserId: string;
  canManage?: boolean;
}

export function TeamMemberCard({
  user,
  roleLabel,
  currentUserId,
  canManage = false,
}: TeamMemberCardProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isCollaborator = user.role === "collaborator";
  const isSelf = user.id === currentUserId;
  const canEdit = canManage && (isCollaborator || isSelf);
  const canDelete = canManage && isCollaborator;

  const handleDelete = async () => {
    const postNote =
      user._count.posts > 0
        ? ` Their ${user._count.posts} post(s) will remain on the site without an author.`
        : "";
    const message = `Delete ${user.name}? This cannot be undone.${postNote}`;
    if (!window.confirm(message)) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        window.alert(data.error || "Failed to delete collaborator");
        return;
      }
      router.refresh();
    } catch {
      window.alert("Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="admin-card p-5 flex gap-4 hover:shadow-md transition-shadow relative">
        <div className="absolute top-4 right-4 flex items-center gap-1">
          {canEdit && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-admin-blue hover:bg-sky-50 transition-colors"
              title="Edit profile"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              title="Delete collaborator"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {user.avatar ? (
          <div className="relative w-14 h-14 shrink-0 rounded-full overflow-hidden ring-2 ring-sky-100 shadow-sm">
            <Image src={user.avatar} alt={user.name} fill className="object-cover" sizes="56px" />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white flex items-center justify-center text-xl font-bold shrink-0">
            {user.name[0]}
          </div>
        )}

        <div className="flex-1 min-w-0 pr-16">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
            {user.role === "administrator" && (
              <Shield className="w-4 h-4 text-amber-500 shrink-0" />
            )}
          </div>
          <p className="text-sm text-gray-500">@{user.username}</p>
          <p className="text-sm text-gray-400 truncate">{user.email}</p>
          <span
            className={`inline-block mt-2 text-xs px-2.5 py-1 rounded-full font-medium ${
              user.role === "administrator"
                ? "bg-amber-50 text-amber-700"
                : "bg-sky-50 text-sky-700"
            }`}
          >
            {roleLabel}
          </span>
          <p className="text-xs text-gray-400 mt-2">{user._count.posts} posts</p>
        </div>
      </div>

      {editing && (
        <EditProfileForm
          user={user}
          open={editing}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  );
}
