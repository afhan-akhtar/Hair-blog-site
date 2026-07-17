"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import type { SessionUser } from "@/lib/auth";

interface AdminShellProps {
  children: React.ReactNode;
  user: SessionUser | null;
}

export function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!user) return null;

  return (
    <div className="admin-theme flex min-h-screen">
      <AdminSidebar user={user} />
      <main className="flex-1 overflow-auto admin-main">{children}</main>
    </div>
  );
}
