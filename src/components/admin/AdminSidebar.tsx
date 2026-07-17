"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  ImageIcon,
  Users,
  Settings,
  ChevronLeft,
  ChevronDown,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { SessionUser } from "@/lib/auth";

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    label: "Posts",
    href: "/admin/posts",
    icon: FileText,
    children: [
      { label: "All Posts", href: "/admin/posts" },
      { label: "Add New", href: "/admin/posts/new" },
      { label: "Drafts", href: "/admin/posts?status=draft" },
      { label: "Scheduled", href: "/admin/posts?status=scheduled" },
      { label: "Trash", href: "/admin/posts?status=trash" },
    ],
  },
  { label: "Categories", href: "/admin/categories", icon: FolderOpen },
  { label: "Media", href: "/admin/media", icon: ImageIcon },
  { label: "Users", href: "/admin/users", icon: Users, adminOnly: true },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const collaboratorNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    label: "Posts",
    href: "/admin/posts",
    icon: FileText,
    children: [
      { label: "My Drafts", href: "/admin/posts?status=draft" },
      { label: "Add New", href: "/admin/posts/new" },
    ],
  },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  user: SessionUser;
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [postsOpen, setPostsOpen] = useState(pathname.startsWith("/admin/posts"));
  const isAdmin = user.role === "administrator";
  const mainNav = isAdmin ? adminNav : collaboratorNav;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="admin-sidebar w-64 flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-serif text-lg font-bold text-white block leading-tight">Hair Edit</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40">Admin Panel</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {mainNav.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          if (item.children) {
            return (
              <div key={item.href}>
                <button
                  onClick={() => setPostsOpen(!postsOpen)}
                  className={cn(
                    "admin-nav-item w-full justify-between",
                    isActive && "admin-nav-item-active"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform opacity-60", postsOpen && "rotate-180")} />
                </button>
                {postsOpen && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l border-white/10 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block px-3 py-2 rounded-lg text-sm transition-all",
                          pathname === child.href.split("?")[0]
                            ? "text-sky-300 bg-white/10 font-medium"
                            : "text-white/50 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("admin-nav-item", isActive && "admin-nav-item-active")}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-plum flex items-center justify-center text-white text-sm font-bold">
            {user.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-white/40 capitalize truncate">{user.role}</p>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-white/50 hover:text-sky-300 transition-colors px-2"
        >
          <ChevronLeft className="w-4 h-4" />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-white/50 hover:text-red-300 transition-colors px-2 w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
