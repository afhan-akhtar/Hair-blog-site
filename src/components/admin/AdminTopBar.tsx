"use client";

import { Menu } from "lucide-react";

interface AdminTopBarProps {
  onMenuClick: () => void;
  collapsed: boolean;
}

export function AdminTopBar({ onMenuClick, collapsed }: AdminTopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-md border-b border-gray-200/80 lg:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <Menu className="w-5 h-5" />
      </button>
      <span className="text-sm text-gray-500 hidden sm:block">Admin Dashboard</span>
    </header>
  );
}
