"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ChevronUp, ChevronDown, Save, CheckCircle2, LayoutGrid } from "lucide-react";
import type { FooterMenu, FooterMenuColumn } from "@/lib/menus";
import type { NavLink } from "@/lib/navigation";

interface FooterMenuEditorProps {
  initialMenu: FooterMenu;
}

export function FooterMenuEditor({ initialMenu }: FooterMenuEditorProps) {
  const router = useRouter();
  const [menu, setMenu] = useState<FooterMenu>(initialMenu);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const updateColumn = (index: number, patch: Partial<FooterMenuColumn>) => {
    const columns = menu.columns.map((col, i) => (i === index ? { ...col, ...patch } : col));
    setMenu({ columns });
    setSuccess(false);
  };

  const updateLink = (colIndex: number, linkIndex: number, patch: Partial<NavLink>) => {
    const columns = [...menu.columns];
    const links = [...columns[colIndex].links];
    links[linkIndex] = { ...links[linkIndex], ...patch };
    columns[colIndex] = { ...columns[colIndex], links };
    setMenu({ columns });
    setSuccess(false);
  };

  const moveColumn = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= menu.columns.length) return;
    const columns = [...menu.columns];
    [columns[index], columns[next]] = [columns[next], columns[index]];
    setMenu({ columns });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ footer_menu: JSON.stringify(menu) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save footer menu");
        return;
      }
      setSuccess(true);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="admin-card p-4 bg-violet-50/50 border-violet-100">
        <p className="text-sm text-violet-800">
          Footer columns appear at the bottom of every page. Add columns and links just like WordPress footer menus.
        </p>
      </div>

      {menu.columns.map((col, ci) => (
        <div key={ci} className="admin-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={col.title}
              onChange={(e) => updateColumn(ci, { title: e.target.value })}
              placeholder="Column title"
              className="admin-input flex-1 font-medium"
            />
            <button
              type="button"
              onClick={() => moveColumn(ci, -1)}
              disabled={ci === 0}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => moveColumn(ci, 1)}
              disabled={ci === menu.columns.length - 1}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                setMenu({ columns: menu.columns.filter((_, i) => i !== ci) })
              }
              className="p-1.5 rounded hover:bg-red-50 text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 pl-1">
            {col.links.map((link, li) => (
              <div key={li} className="flex gap-2">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateLink(ci, li, { label: e.target.value })}
                  placeholder="Label"
                  className="admin-input flex-1"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => updateLink(ci, li, { href: e.target.value })}
                  placeholder="/path"
                  className="admin-input flex-1"
                />
                <button
                  type="button"
                  onClick={() => {
                    const links = col.links.filter((_, i) => i !== li);
                    updateColumn(ci, { links });
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => updateColumn(ci, { links: [...col.links, { label: "", href: "" }] })}
              className="text-sm text-sky-600 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add link
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          setMenu({
            columns: [...menu.columns, { title: "New Column", links: [{ label: "", href: "" }] }],
          })
        }
        className="w-full admin-card p-4 border-2 border-dashed border-gray-200 hover:border-violet-300 hover:bg-violet-50/30 transition-all flex items-center justify-center gap-2 text-gray-600"
      >
        <Plus className="w-4 h-4" /> Add column
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          Footer menu saved
        </div>
      )}

      <button onClick={handleSave} disabled={saving} className="admin-btn-primary flex items-center gap-2">
        <Save className="w-4 h-4" />
        {saving ? "Saving..." : "Save Footer Menu"}
      </button>
    </div>
  );
}
