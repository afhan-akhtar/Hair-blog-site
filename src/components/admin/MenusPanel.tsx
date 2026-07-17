"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { HeaderMenuEditor } from "@/components/admin/HeaderMenuEditor";
import { FooterMenuEditor } from "@/components/admin/FooterMenuEditor";
import type { NavItem } from "@/lib/navigation";
import type { FooterMenu } from "@/lib/menus";

interface MenusPanelProps {
  headerMenu: NavItem[];
  footerMenu: FooterMenu;
}

export function MenusPanel({ headerMenu, footerMenu }: MenusPanelProps) {
  const [tab, setTab] = useState<"header" | "footer">("header");

  return (
    <div>
      <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
        {(["header", "footer"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer",
              tab === t
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {t === "header" ? "Header Menu" : "Footer Menu"}
          </button>
        ))}
      </div>

      {tab === "header" ? (
        <HeaderMenuEditor initialMenu={headerMenu} />
      ) : (
        <FooterMenuEditor initialMenu={footerMenu} />
      )}
    </div>
  );
}
