import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { AddCollaboratorForm } from "@/components/admin/AddCollaboratorForm";
import { Shield, UserCog } from "lucide-react";

const roleLabels: Record<string, string> = {
  administrator: "Administrator",
  collaborator: "Collaborator",
};

const rolePermissions: Record<string, string[]> = {
  administrator: ["Full access", "Publish posts", "Manage collaborators", "Site settings"],
  collaborator: ["Create & edit drafts only", "Cannot publish posts", "Change own password"],
};

export default async function UsersPage() {
  const session = await getSession();
  if (session?.role !== "administrator") {
    redirect("/admin");
  }

  const users = await prisma.user.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team & Permissions</h1>
          <p className="text-gray-500 text-sm mt-1">Manage administrators and collaborators</p>
        </div>
        <AddCollaboratorForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {users.map((user) => (
          <div key={user.id} className="admin-card p-5 flex gap-4 hover:shadow-md transition-shadow">
            {user.avatar ? (
              <div className="relative w-14 h-14 shrink-0 rounded-full overflow-hidden ring-2 ring-sky-100 shadow-sm">
                <Image src={user.avatar} alt={user.name} fill className="object-cover" sizes="56px" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white flex items-center justify-center text-xl font-bold shrink-0">
                {user.name[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                {user.role === "administrator" && (
                  <Shield className="w-4 h-4 text-amber-500 shrink-0" />
                )}
              </div>
              <p className="text-sm text-gray-500">@{user.username}</p>
              <p className="text-sm text-gray-400 truncate">{user.email}</p>
              <span className={`inline-block mt-2 text-xs px-2.5 py-1 rounded-full font-medium ${
                user.role === "administrator"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-sky-50 text-sky-700"
              }`}>
                {roleLabels[user.role] || user.role}
              </span>
              <p className="text-xs text-gray-400 mt-2">{user._count.posts} posts</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <UserCog className="w-5 h-5 text-gray-400" />
          <h2 className="font-semibold text-gray-900">Role Permissions</h2>
        </div>
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
                <td className="font-medium">{roleLabels[role]}</td>
                <td className="text-gray-600 text-sm">{perms.join(" · ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
