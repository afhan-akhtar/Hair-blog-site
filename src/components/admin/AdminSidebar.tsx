"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Sparkles,
  ImageIcon,
  Calendar,
  Search,
  Link2,
  ArrowRightLeft,
  MessageSquare,
  Users,
  Mail,
  BarChart3,
  Palette,
  Menu,
  Shield,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Posts", href: "/admin/posts", icon: FileText },
  { label: "Categories", href: "/admin/categories", icon: FolderOpen },
  { label: "Hair Attributes", href: "/admin/hair-attributes", icon: Sparkles },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon },
  { label: "Content Calendar", href: "/admin/calendar", icon: Calendar },
  { label: "SEO Center", href: "/admin/seo", icon: Search },
  { label: "Internal Links", href: "/admin/internal-links", icon: Link2 },
  { label: "Redirects", href: "/admin/redirects", icon: ArrowRightLeft },
  { label: "Comments", href: "/admin/comments", icon: MessageSquare },
  { label: "Authors and Experts", href: "/admin/authors", icon: Users },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Appearance", href: "/admin/appearance", icon: Palette },
  { label: "Menus", href: "/admin/menus", icon: Menu },
  { label: "Users and Roles", href: "/admin/users", icon: Shield },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#111] border-r border-white/10 flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-serif text-xl font-bold">Hair Club</span>
          <span className="text-xs bg-plum px-2 py-0.5 rounded text-white/80">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          View Site
        </Link>
      </div>
    </aside>
  );
}
