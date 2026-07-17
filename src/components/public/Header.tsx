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
    <div className="animate-dropdown-in border-t border-black/5 bg-white/95 backdrop-blur-xl shadow-[0_24px_80px_rgba(93,58,66,0.14)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_280px] gap-0 rounded-[22px] overflow-hidden border border-black/[0.06] shadow-sm">
          {columns.map((col, i) => (
            <div
              key={col.title}
              className={cn(
                "p-8 bg-white transition-colors duration-300 hover:bg-cream/40",
                i < columns.length - 1 && "md:border-r border-black/5",
                i > 0 && "border-t md:border-t-0 border-black/5"
              )}
            >
              <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-terracotta mb-5">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="dropdown-link text-[15px] text-charcoal leading-snug"
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
            className="image-zoom-wrap relative block min-h-[280px] md:min-h-[300px] group cursor-pointer border-t md:border-t-0 border-black/5 overflow-hidden"
          >
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              sizes="280px"
              className="object-cover zoom-target"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-500 group-hover:from-black/90" />
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-1 transition-transform duration-500 group-hover:translate-y-0">
              <span className="inline-block bg-white/95 text-charcoal text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full shadow-sm">
                {featured.tag}
              </span>
              <p className="font-serif text-base font-bold text-white mt-3 leading-snug group-hover:text-rose transition-colors duration-300">
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
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const activeItem = MAIN_NAV.find((item) => item.label === openMenu);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target;
      if (
        target instanceof Node &&
        headerRef.current &&
        !headerRef.current.contains(target)
      ) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  const handleHeaderMouseLeave = (e: React.MouseEvent) => {
    const related = e.relatedTarget;
    if (!(related instanceof Node) || !headerRef.current?.contains(related)) {
      setOpenMenu(null);
    }
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      {/* Backdrop when mega menu open */}
      {openMenu && (
        <div
          className="hidden lg:block fixed inset-0 top-[76px] bg-black/20 backdrop-blur-[2px] z-40 transition-opacity duration-300 cursor-default"
          onClick={() => setOpenMenu(null)}
          aria-hidden="true"
        />
      )}

      <header
        ref={headerRef}
        className={cn(
          "bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b relative transition-shadow duration-300",
          scrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.06)] border-black/[0.06]" : "border-black/5",
          openMenu && "border-transparent shadow-none"
        )}
        onMouseLeave={handleHeaderMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <div className="flex items-center justify-between h-[76px]">
            <Link
              href="/"
              className="flex-shrink-0 z-10 group cursor-pointer"
            >
              <span className="font-serif text-[1.5rem] font-bold text-charcoal leading-none block transition-colors duration-300 group-hover:text-plum">
                {SITE.name}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-terracotta mt-1 block transition-tracking duration-300 group-hover:tracking-[0.35em]">
                {SITE.tagline}
              </span>
            </Link>

            <div className="hidden lg:flex flex-1 mx-10">
              <nav className="flex items-center justify-center gap-1 w-full">
                {MAIN_NAV.map((item) => (
                  <div key={item.label}>
                    {item.mega ? (
                      <button
                        type="button"
                        className={cn(
                          "nav-trigger flex items-center gap-1.5 text-sm font-medium py-2.5 px-3 rounded-lg cursor-pointer",
                          openMenu === item.label || isActive(item.href)
                            ? "text-terracotta is-active"
                            : "text-charcoal hover:text-terracotta hover:bg-terracotta/5"
                        )}
                        onMouseEnter={() => setOpenMenu(item.label)}
                        onClick={() =>
                          setOpenMenu(openMenu === item.label ? null : item.label)
                        }
                        aria-expanded={openMenu === item.label}
                        aria-haspopup="true"
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            "w-3.5 h-3.5 transition-transform duration-300 ease-out",
                            openMenu === item.label && "rotate-180"
                          )}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "nav-trigger text-sm font-medium py-2.5 px-3 rounded-lg cursor-pointer",
                          isActive(item.href)
                            ? "text-terracotta is-active"
                            : "text-charcoal hover:text-terracotta hover:bg-terracotta/5"
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
                type="button"
                aria-label="Search"
                className="p-2.5 rounded-full border border-black/10 hover:border-terracotta/50 hover:bg-terracotta/10 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <Search className="w-4 h-4 text-charcoal" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                aria-label="Menu"
                className="lg:hidden p-2.5 rounded-full hover:bg-black/5 hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {activeItem?.mega && (
          <div className="hidden lg:block absolute left-0 right-0 top-full z-50">
            <MegaMenuPanel item={activeItem} onClose={() => setOpenMenu(null)} />
          </div>
        )}

        {mobileOpen && (
          <div className="lg:hidden border-t border-black/5 bg-white/98 backdrop-blur-lg max-h-[80vh] overflow-y-auto animate-dropdown-in">
            <nav className="px-5 py-4 space-y-1">
              {MAIN_NAV.map((item) => (
                <div key={item.label}>
                  {item.mega ? (
                    <>
                      <button
                        type="button"
                        className="flex items-center justify-between w-full py-3.5 text-sm font-medium text-charcoal border-b border-black/5 cursor-pointer hover:text-terracotta transition-colors"
                        onClick={() =>
                          setMobileExpanded(
                            mobileExpanded === item.label ? null : item.label
                          )
                        }
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 transition-transform duration-300",
                            mobileExpanded === item.label && "rotate-180"
                          )}
                        />
                      </button>
                      {mobileExpanded === item.label && (
                        <div className="py-4 space-y-5 bg-cream/60 rounded-2xl px-4 my-2 animate-dropdown-in">
                          {item.mega.columns.map((col) => (
                            <div key={col.title}>
                              <p className="text-[10px] font-bold text-terracotta uppercase tracking-wider mb-2">
                                {col.title}
                              </p>
                              {col.links.map((link) => (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  className="block py-2 text-sm text-gray-700 hover:text-terracotta cursor-pointer transition-colors"
                                >
                                  {link.label}
                                </Link>
                              ))}
                            </div>
                          ))}
                          <Link
                            href={item.mega.featured.href}
                            className="flex items-center gap-3 pt-2 border-t border-black/5 cursor-pointer group"
                          >
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 image-zoom-wrap">
                              <Image
                                src={item.mega.featured.image}
                                alt=""
                                fill
                                className="object-cover zoom-target"
                              />
                            </div>
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-terracotta">
                                {item.mega.featured.tag}
                              </span>
                              <p className="text-sm font-medium text-charcoal mt-0.5 leading-snug group-hover:text-terracotta transition-colors">
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
                      className="block py-3.5 text-sm font-medium text-charcoal hover:text-terracotta border-b border-black/5 cursor-pointer transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <Link
                href="/contact"
                className="block py-3.5 text-sm font-medium text-charcoal hover:text-terracotta cursor-pointer transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
