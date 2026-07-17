import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { getSiteSettings } from "@/lib/site-settings";
import { getHeaderMenu, getFooterMenu } from "@/lib/menus";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [branding, menu, footerMenu] = await Promise.all([
    getSiteSettings(),
    getHeaderMenu(),
    getFooterMenu(),
  ]);

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      <Header branding={branding} menu={menu} />
      <main className="flex-1">{children}</main>
      <Footer branding={branding} footerMenu={footerMenu} />
    </div>
  );
}
