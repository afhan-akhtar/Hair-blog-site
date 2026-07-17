"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import type { SessionUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  children: React.ReactNode;
  user: SessionUser | null;
}

export function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin-sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!user) return null;

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen((o) => !o);
    } else {
      const next = !collapsed;
      setCollapsed(next);
      localStorage.setItem("admin-sidebar-collapsed", String(next));
    }
  };

  return (
    <div className="admin-theme flex min-h-screen">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      )}

      <AdminSidebar
        user={user}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          collapsed ? "lg:ml-[72px]" : "lg:ml-64"
        )}
      >
        <AdminTopBar onMenuClick={toggleSidebar} collapsed={collapsed} />
        <main className="flex-1 overflow-auto admin-main">{children}</main>
      </div>
    </div>
  );
}
