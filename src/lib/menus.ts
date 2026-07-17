import { MAIN_NAV, FOOTER_LINKS, type NavItem, type NavLink } from "@/lib/navigation";
import { getSiteSettings } from "@/lib/site-settings";

export type { NavItem, NavLink, NavColumn, NavFeatured } from "@/lib/navigation";

export interface FooterMenuColumn {
  title: string;
  links: NavLink[];
}

export interface FooterMenu {
  columns: FooterMenuColumn[];
}

export const DEFAULT_HEADER_MENU: NavItem[] = MAIN_NAV;

export const DEFAULT_FOOTER_MENU: FooterMenu = {
  columns: [
    { title: "Explore", links: FOOTER_LINKS.explore },
    { title: "Company", links: FOOTER_LINKS.company },
    { title: "Legal", links: FOOTER_LINKS.legal },
  ],
};

export function parseHeaderMenu(json: string | undefined | null): NavItem[] {
  if (!json?.trim()) return DEFAULT_HEADER_MENU;
  try {
    const parsed = JSON.parse(json) as NavItem[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    /* use default */
  }
  return DEFAULT_HEADER_MENU;
}

export function serializeHeaderMenu(menu: NavItem[]): string {
  return JSON.stringify(menu);
}

export async function getHeaderMenu(): Promise<NavItem[]> {
  const settings = await getSiteSettings();
  return parseHeaderMenu(settings.header_menu);
}

export function parseFooterMenu(json: string | undefined | null): FooterMenu {
  if (!json?.trim()) return DEFAULT_FOOTER_MENU;
  try {
    const parsed = JSON.parse(json) as FooterMenu;
    if (parsed?.columns?.length) return parsed;
  } catch {
    /* use default */
  }
  return DEFAULT_FOOTER_MENU;
}

export async function getFooterMenu(): Promise<FooterMenu> {
  const settings = await getSiteSettings();
  return parseFooterMenu(settings.footer_menu);
}
