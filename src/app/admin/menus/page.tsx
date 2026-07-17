import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getHeaderMenu, getFooterMenu } from "@/lib/menus";
import { MenusPanel } from "@/components/admin/MenusPanel";
import { Menu } from "lucide-react";

export default async function MenusPage() {
  const session = await getSession();
  if (session?.role !== "administrator") {
    redirect("/admin");
  }

  const [headerMenu, footerMenu] = await Promise.all([getHeaderMenu(), getFooterMenu()]);

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
            <Menu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Menus</h1>
            <p className="text-gray-500 text-sm">Customize header and footer navigation</p>
          </div>
        </div>
      </div>

      <MenusPanel headerMenu={headerMenu} footerMenu={footerMenu} />
    </div>
  );
}
