import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PasswordChangeForm } from "@/components/admin/PasswordChangeForm";
import { KeyRound, Globe } from "lucide-react";

export default async function SettingsPage() {
  const session = await getSession();
  const isAdmin = session?.role === "administrator";

  const settings = isAdmin ? await prisma.siteSetting.findMany() : [];
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  const sections = [
    {
      title: "General SEO",
      icon: Globe,
      fields: [
        { key: "site_title", label: "Site Title", value: settingsMap.site_title || "The Hair Edit" },
        { key: "site_description", label: "Site Description", value: settingsMap.site_description || "" },
        { key: "google_analytics", label: "Google Analytics ID", value: settingsMap.google_analytics || "" },
      ],
    },
    {
      title: "Publisher Details",
      fields: [
        { key: "publisher_name", label: "Publisher Name", value: settingsMap.publisher_name || "The Hair Edit" },
        { key: "publisher_logo", label: "Publisher Logo URL", value: settingsMap.publisher_logo || "" },
      ],
    },
    {
      title: "Social Profiles",
      fields: [
        { key: "social_instagram", label: "Instagram", value: settingsMap.social_instagram || "" },
        { key: "social_pinterest", label: "Pinterest", value: settingsMap.social_pinterest || "" },
        { key: "social_tiktok", label: "TikTok", value: settingsMap.social_tiktok || "" },
      ],
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and site preferences</p>
      </div>

      <div className="space-y-6">
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

        {isAdmin &&
          sections.map((section) => (
            <div key={section.title} className="admin-card p-6">
              <h2 className="font-semibold text-gray-900 mb-4">{section.title}</h2>
              <div className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.key}>
                    <label className="admin-label">{field.label}</label>
                    <input
                      type="text"
                      defaultValue={field.value}
                      className="admin-input"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

        {isAdmin && (
          <button className="admin-btn-primary">Save Site Settings</button>
        )}
      </div>
    </div>
  );
}
