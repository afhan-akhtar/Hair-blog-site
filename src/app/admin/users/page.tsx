import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AddCollaboratorForm } from "@/components/admin/AddCollaboratorForm";
import { TeamMemberCard } from "@/components/admin/TeamMemberCard";
import { UserCog } from "lucide-react";

const roleLabels: Record<string, string> = {
  administrator: "Administrator",
  collaborator: "Collaborator",
};

const rolePermissions: Record<string, string[]> = {
  administrator: ["Full access", "Publish posts", "Manage collaborators", "Remove collaborators", "Site settings"],
  collaborator: ["Create & edit drafts only", "Cannot publish posts", "Edit own profile only", "Change own password"],
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team & Permissions</h1>
          <p className="text-gray-500 text-sm mt-1">Manage administrators and collaborators</p>
        </div>
        <AddCollaboratorForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {users.map((user) => (
          <TeamMemberCard
            key={user.id}
            user={user}
            roleLabel={roleLabels[user.role] || user.role}
            currentUserId={session.id}
            canManage={session.role === "administrator"}
          />
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
