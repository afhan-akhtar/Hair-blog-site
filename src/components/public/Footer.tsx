import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";
import type { SiteSettings } from "@/lib/site-settings";
import type { FooterMenu } from "@/lib/menus";

function CopyrightText({
  text,
  siteTitle,
  siteLink,
}: {
  text: string;
  siteTitle: string;
  siteLink: string;
}) {
  const withYear = text.replace(/\{year\}/g, String(new Date().getFullYear()));
  const parts = withYear.split("{site}");

  if (parts.length === 1) {
    return <>{withYear}</>;
  }

  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <Link
              href={siteLink || "/"}
              className="text-white/50 hover:text-white transition-colors duration-300 cursor-pointer underline-offset-2 hover:underline"
            >
              {siteTitle}
            </Link>
          )}
        </Fragment>
      ))}
    </>
  );
}

interface FooterProps {
  branding: SiteSettings;
  footerMenu: FooterMenu;
}

export function Footer({ branding, footerMenu }: FooterProps) {
  const socials = [
    { label: "Instagram", href: branding.social_instagram },
    { label: "Pinterest", href: branding.social_pinterest },
    { label: "TikTok", href: branding.social_tiktok },
  ].filter((s) => s.href);

  return (
    <footer className="bg-plum-dark text-white">
      <div className="site-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <Link href="/" className="group cursor-pointer inline-block">
              {branding.site_logo ? (
                <Image
                  src={branding.site_logo}
                  alt={branding.site_title}
                  width={160}
                  height={48}
                  className="h-10 w-auto object-contain brightness-0 invert"
                  unoptimized={branding.site_logo.startsWith("/uploads")}
                />
              ) : (
                <span className="font-serif text-2xl font-bold block transition-colors duration-300 group-hover:text-rose">
                  {branding.site_title}
                </span>
              )}
              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-terracotta mt-1 block">
                {branding.site_tagline}
              </span>
            </Link>
            <p className="text-white/55 text-sm leading-relaxed max-w-sm mt-5">
              {branding.site_description}
            </p>
            {socials.length > 0 && (
              <div className="flex gap-5 mt-6 text-sm text-white/45">
                {socials.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {footerMenu.columns.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h4 className="font-semibold mb-4 text-xs uppercase tracking-[0.15em] text-white/70">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-sm text-white/50">
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="inline-block hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-sm text-white/35">
            <CopyrightText
              text={branding.copyright_text || "© {year} {site}. All rights reserved."}
              siteTitle={branding.site_title}
              siteLink={branding.copyright_link || "/"}
            />
          </p>
          <Link
            href="/admin"
            className="text-xs text-white/25 hover:text-white/60 transition-colors duration-300 cursor-pointer"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
