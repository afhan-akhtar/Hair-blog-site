import { prisma } from "@/lib/db";

export default async function SettingsPage() {
  const settings = await prisma.siteSetting.findMany();
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  const sections = [
    {
      title: "General SEO",
      fields: [
        { key: "site_title", label: "Site Title", value: settingsMap.site_title || "Hair Club" },
        { key: "site_description", label: "Site Description", value: settingsMap.site_description || "" },
        { key: "google_analytics", label: "Google Analytics ID", value: settingsMap.google_analytics || "" },
      ],
    },
    {
      title: "Publisher Details",
      fields: [
        { key: "publisher_name", label: "Publisher Name", value: settingsMap.publisher_name || "Hair Club" },
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
    <div className="p-6">
      <h1 className="admin-section-title mb-6">Site Settings</h1>

      <div className="space-y-6 max-w-2xl">
        {sections.map((section) => (
          <div key={section.title} className="admin-card p-5">
            <h2 className="font-semibold text-admin-blue mb-4">{section.title}</h2>
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="text-xs uppercase tracking-wider text-gray-500 mb-1 block font-medium">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    defaultValue={field.value}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-admin-blue/30"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button className="px-6 py-2.5 bg-admin-blue text-white rounded-lg text-sm font-medium hover:bg-admin-blue-dark">
          Save Settings
        </button>
      </div>
    </div>
  );
}
