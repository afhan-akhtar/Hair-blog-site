import { prisma } from "@/lib/db";
import Image from "next/image";
import { Plus } from "lucide-react";

const roleLabels: Record<string, string> = {
  administrator: "Administrator",
  editor: "Editor",
  author: "Author",
};

const rolePermissions: Record<string, string[]> = {
  administrator: ["Full access to posts, categories, media, users, and settings"],
  editor: ["Create, edit, publish all posts", "Manage categories and media", "Edit post SEO fields"],
  author: ["Create and edit own posts", "Upload media", "Submit drafts for review"],
};

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="admin-section-title">Users and Permissions</h1>
          <p className="text-gray-500 text-sm mt-1">Manage administrator, editor, and author accounts</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-admin-blue text-white rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {users.map((user) => (
          <div key={user.id} className="admin-card p-5 flex gap-4">
            {user.avatar ? (
              <Image src={user.avatar} alt={user.name} width={56} height={56} className="rounded-full" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-admin-blue text-white flex items-center justify-center text-xl font-bold">
                {user.name[0]}
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-admin-blue font-medium capitalize">
                {roleLabels[user.role] || user.role}
              </span>
              <p className="text-xs text-gray-400 mt-2">{user._count.posts} posts</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card overflow-hidden">
        <table className="admin-table w-full">
          <thead>
            <tr>
              <th>Role</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(rolePermissions).map(([role, perms]) => (
              <tr key={role}>
                <td className="font-medium capitalize">{roleLabels[role]}</td>
                <td className="text-gray-600 text-sm">{perms.join(" · ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
