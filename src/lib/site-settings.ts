import { prisma } from "@/lib/db";

export type SiteSettings = {
  site_title: string;
  site_tagline: string;
  site_description: string;
  site_logo: string;
  site_favicon: string;
  hero_video: string;
  publisher_name: string;
  publisher_logo: string;
  google_analytics: string;
  social_instagram: string;
  social_pinterest: string;
  social_tiktok: string;
  copyright_text: string;
  copyright_link: string;
  header_menu: string;
  footer_menu: string;
};

const DEFAULTS: SiteSettings = {
  site_title: "The Hair Edit",
  site_tagline: "Hair • Beauty • Style",
  site_description:
    "Beauty advice that feels inspiring—and genuinely useful. Hairstyles, hair color, and hair care from experts.",
  site_logo: "",
  site_favicon: "",
  hero_video: "",
  publisher_name: "The Hair Edit",
  publisher_logo: "",
  google_analytics: "",
  social_instagram: "",
  social_pinterest: "",
  social_tiktok: "",
  copyright_text: "© {year} {site}. All rights reserved.",
  copyright_link: "/",
  header_menu: "",
  footer_menu: "",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const rows = await prisma.siteSetting.findMany();
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return { ...DEFAULTS, ...map } as SiteSettings;
}

export const SITE_SETTING_KEYS = Object.keys(DEFAULTS) as (keyof SiteSettings)[];
