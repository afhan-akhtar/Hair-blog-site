import Link from "next/link";
import { SITE, FOOTER_LINKS } from "@/lib/navigation";

export function Footer() {
  return (
    <footer className="bg-plum-dark text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <Link href="/" className="group cursor-pointer inline-block">
              <span className="font-serif text-2xl font-bold block transition-colors duration-300 group-hover:text-rose">
                {SITE.name}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-terracotta mt-1 block">
                {SITE.tagline}
              </span>
            </Link>
            <p className="text-white/55 text-sm leading-relaxed max-w-sm mt-5">
              {SITE.description}
            </p>
            <div className="flex gap-5 mt-6 text-sm text-white/45">
              {["Instagram", "Pinterest", "TikTok"].map((s) => (
                <Link
                  key={s}
                  href="#"
                  className="hover:text-white hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {[
            { title: "Explore", links: FOOTER_LINKS.explore },
            { title: "Company", links: FOOTER_LINKS.company },
            { title: "Legal", links: FOOTER_LINKS.legal },
          ].map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h4 className="font-semibold mb-4 text-xs uppercase tracking-[0.15em] text-white/70">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-sm text-white/50">
                {col.links.map((link) => (
                  <li key={link.href}>
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
          <p className="text-sm text-white/35">© 2025 {SITE.name}. All rights reserved.</p>
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
