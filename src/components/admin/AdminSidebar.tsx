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
  Menu,
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
  { label: "Menus", href: "/admin/menus", icon: Menu, adminOnly: true },
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

type NavEntry = (typeof adminNav)[number];

function filterAdminNav(nav: NavEntry[], isAdmin: boolean) {
  return nav.filter((item) => !("adminOnly" in item && item.adminOnly) || isAdmin);
}

interface AdminSidebarProps {
  user: SessionUser;
  collapsed: boolean;
  mobileOpen: boolean;
  onNavigate?: () => void;
}

export function AdminSidebar({ user, collapsed, mobileOpen, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [postsOpen, setPostsOpen] = useState(pathname.startsWith("/admin/posts"));
  const isAdmin = user.role === "administrator";
  const mainNav = filterAdminNav(isAdmin ? adminNav : collaboratorNav, isAdmin);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside
      className={cn(
        "admin-sidebar flex flex-col h-screen fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className={cn("border-b border-white/10", collapsed ? "p-4" : "p-5")}>
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-serif text-lg font-bold text-white block leading-tight">Hair Edit</span>
              <span className="text-[10px] uppercase tracking-widest text-white/40">Admin Panel</span>
            </div>
          )}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
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
                  onClick={() => !collapsed && setPostsOpen(!postsOpen)}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "admin-nav-item w-full",
                    !collapsed && "justify-between",
                    collapsed && "justify-center px-0",
                    isActive && "admin-nav-item-active"
                  )}
                >
                  <span className={cn("flex items-center gap-3", collapsed && "justify-center")}>
                    <Icon className="w-4 h-4 shrink-0" />
                    {!collapsed && item.label}
                  </span>
                  {!collapsed && (
                    <ChevronDown className={cn("w-4 h-4 transition-transform opacity-60", postsOpen && "rotate-180")} />
                  )}
                </button>
                {postsOpen && !collapsed && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l border-white/10 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onNavigate}
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
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={cn(
                "admin-nav-item",
                collapsed && "justify-center px-0",
                isActive && "admin-nav-item-active"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      <div className={cn("border-t border-white/10 space-y-3", collapsed ? "p-3" : "p-4")}>
        <div className={cn("flex items-center gap-3", collapsed ? "justify-center px-0" : "px-2")}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-plum flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user.name[0]}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-white/40 capitalize truncate">{user.role}</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <>
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
          </>
        )}
      </div>
    </aside>
  );
}
