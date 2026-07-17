"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  ImageIcon,
  Users,
  Settings,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const mainNav = [
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
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [postsOpen, setPostsOpen] = useState(pathname.startsWith("/admin/posts"));

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 shadow-sm">
      <div className="p-5 border-b border-gray-200">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-serif text-xl font-bold text-admin-blue">Hair Club</span>
        </Link>
        <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
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
                    "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                    isActive
                      ? "bg-blue-50 text-admin-blue font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", postsOpen && "rotate-180")} />
                </button>
                {postsOpen && (
                  <div className="ml-7 mt-1 space-y-0.5">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block px-3 py-2 rounded-lg text-sm transition-colors",
                          pathname === child.href || (child.href.includes("?") && false)
                            ? "text-admin-blue font-medium bg-blue-50"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
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
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-blue-50 text-admin-blue font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-admin-blue transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          View Site
        </Link>
      </div>
    </aside>
  );
}
