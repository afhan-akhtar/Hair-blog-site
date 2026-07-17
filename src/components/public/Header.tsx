"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ChevronDown, Menu, X } from "lucide-react";
import { MAIN_NAV, SITE, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function MegaMenuPanel({
  item,
  onClose,
}: {
  item: NavItem;
  onClose: () => void;
}) {
  if (!item.mega) return null;
  const { columns, featured } = item.mega;

  return (
    <div className="border-t border-black/5 bg-white shadow-[0_24px_64px_rgba(0,0,0,0.10)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_260px] gap-0 rounded-[20px] overflow-hidden border border-black/5">
          {columns.map((col, i) => (
            <div
              key={col.title}
              className={cn(
                "p-8 bg-white",
                i < columns.length - 1 && "md:border-r border-black/5",
                i > 0 && "border-t md:border-t-0 border-black/5"
              )}
            >
              <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400 mb-5">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="text-[15px] text-charcoal hover:text-terracotta transition-colors leading-snug"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <Link
            href={featured.href}
            onClick={onClose}
            className="relative block min-h-[240px] md:min-h-0 group border-t md:border-t-0 border-black/5"
          >
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              sizes="260px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="inline-block bg-white/90 text-charcoal text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full">
                {featured.tag}
              </span>
              <p className="font-serif text-base font-bold text-white mt-3 leading-snug">
                {featured.title}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  const activeItem = MAIN_NAV.find((item) => item.label === openMenu);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  const handleHeaderMouseLeave = (e: React.MouseEvent) => {
    const related = e.relatedTarget as Node | null;
    if (!headerRef.current?.contains(related)) {
      setOpenMenu(null);
    }
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header
      ref={headerRef}
      className="bg-white sticky top-0 z-50 border-b border-black/5 relative"
      onMouseLeave={handleHeaderMouseLeave}
    >
      {/* Nav bar */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-[76px]">
          <Link href="/" className="flex-shrink-0 z-10">
            <span className="font-serif text-[1.5rem] font-bold text-charcoal leading-none block">
              {SITE.name}
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-terracotta mt-1 block">
              {SITE.tagline}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex flex-1 mx-10">
            <nav className="flex items-center justify-center gap-8 w-full">
              {MAIN_NAV.map((item) => (
                <div key={item.label}>
                  {item.mega ? (
                    <button
                      className={cn(
                        "flex items-center gap-1.5 text-sm font-medium transition-colors py-2 px-1",
                        openMenu === item.label || isActive(item.href)
                          ? "text-terracotta"
                          : "text-charcoal hover:text-terracotta"
                      )}
                      onMouseEnter={() => setOpenMenu(item.label)}
                      onClick={() =>
                        setOpenMenu(
                          openMenu === item.label ? null : item.label
                        )
                      }
                      aria-expanded={openMenu === item.label}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 transition-transform duration-200",
                          openMenu === item.label && "rotate-180"
                        )}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "text-sm font-medium transition-colors py-2 px-1",
                        isActive(item.href)
                          ? "text-terracotta"
                          : "text-charcoal hover:text-terracotta"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 z-10">
            <button
              aria-label="Search"
              className="p-2.5 rounded-full border border-black/10 hover:border-terracotta/40 hover:bg-terracotta/5 transition-colors"
            >
              <Search className="w-4 h-4 text-charcoal" strokeWidth={1.75} />
            </button>
            <button
              aria-label="Menu"
              className="lg:hidden p-2.5 rounded-full hover:bg-black/5 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Full-width mega menu */}
      {activeItem?.mega && (
        <div className="hidden lg:block absolute left-0 right-0 top-full z-50">
          <MegaMenuPanel item={activeItem} onClose={() => setOpenMenu(null)} />
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-black/5 bg-white max-h-[80vh] overflow-y-auto">
          <nav className="px-5 py-4 space-y-1">
            {MAIN_NAV.map((item) => (
              <div key={item.label}>
                {item.mega ? (
                  <>
                    <button
                      className="flex items-center justify-between w-full py-3.5 text-sm font-medium text-charcoal border-b border-black/5"
                      onClick={() =>
                        setMobileExpanded(
                          mobileExpanded === item.label ? null : item.label
                        )
                      }
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          mobileExpanded === item.label && "rotate-180"
                        )}
                      />
                    </button>
                    {mobileExpanded === item.label && (
                      <div className="py-4 space-y-5 bg-cream/50 rounded-xl px-4 my-2">
                        {item.mega.columns.map((col) => (
                          <div key={col.title}>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                              {col.title}
                            </p>
                            {col.links.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className="block py-2 text-sm text-gray-700 hover:text-terracotta"
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                        <Link
                          href={item.mega.featured.href}
                          className="flex items-center gap-3 pt-2 border-t border-black/5"
                        >
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                              src={item.mega.featured.image}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-terracotta">
                              {item.mega.featured.tag}
                            </span>
                            <p className="text-sm font-medium text-charcoal mt-0.5 leading-snug">
                              {item.mega.featured.title}
                            </p>
                          </div>
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block py-3.5 text-sm font-medium text-charcoal hover:text-terracotta border-b border-black/5"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <Link
              href="/contact"
              className="block py-3.5 text-sm font-medium text-charcoal hover:text-terracotta"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
