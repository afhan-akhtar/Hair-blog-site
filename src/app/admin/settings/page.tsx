import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PasswordChangeForm } from "@/components/admin/PasswordChangeForm";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { EditProfileForm } from "@/components/admin/EditProfileForm";
import { getSiteSettings } from "@/lib/site-settings";
import { KeyRound, UserRound } from "lucide-react";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const isAdmin = session.role === "administrator";
  const [siteSettings, profile] = await Promise.all([
    isAdmin ? getSiteSettings() : null,
    prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true, name: true, username: true, email: true, avatar: true, bio: true },
    }),
  ]);

  if (!profile) redirect("/admin/login");

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and site branding</p>
      </div>

      <div className="space-y-6">
        <div className="admin-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
              <UserRound className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Profile</h2>
              <p className="text-sm text-gray-500">Update your name, username, photo, and bio</p>
            </div>
          </div>
          <EditProfileForm user={profile} inline />
        </div>

        <div className="admin-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Change Password</h2>
              <p className="text-sm text-gray-500">Update your login credentials</p>
            </div>
          </div>
          <PasswordChangeForm />
        </div>

        {isAdmin && siteSettings && <SiteSettingsForm initial={siteSettings} />}
      </div>
    </div>
  );
}
