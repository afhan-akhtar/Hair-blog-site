"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  CheckCircle2,
  Menu,
} from "lucide-react";
import type { NavItem, NavLink, NavColumn } from "@/lib/navigation";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { cn } from "@/lib/utils";

type MenuType = "link" | "dropdown" | "mega";

function getMenuType(item: NavItem): MenuType {
  if (item.mega) return "mega";
  if (item.children?.length) return "dropdown";
  return "link";
}

function emptyMega(): NonNullable<NavItem["mega"]> {
  return {
    columns: [{ title: "Links", links: [{ label: "", href: "" }] }],
    featured: { tag: "Featured", title: "", href: "", image: "" },
  };
}

interface HeaderMenuEditorProps {
  initialMenu: NavItem[];
}

export function HeaderMenuEditor({ initialMenu }: HeaderMenuEditorProps) {
  const router = useRouter();
  const [items, setItems] = useState<NavItem[]>(initialMenu);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);

  const updateItem = (index: number, patch: Partial<NavItem>) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
    setSuccess(false);
  };

  const setMenuType = (index: number, type: MenuType) => {
    const item = items[index];
    if (type === "link") {
      updateItem(index, { mega: undefined, children: undefined });
    } else if (type === "dropdown") {
      updateItem(index, {
        mega: undefined,
        children: item.children?.length ? item.children : [{ label: "", href: "" }],
      });
    } else {
      updateItem(index, { children: undefined, mega: item.mega || emptyMega() });
    }
  };

  const moveItem = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= items.length) return;
    const copy = [...items];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setItems(copy);
    setExpanded(next);
  };

  const addItem = () => {
    setItems((prev) => [...prev, { label: "New Item", href: "/" }]);
    setExpanded(items.length);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    setExpanded(null);
  };

  const updateChild = (itemIndex: number, childIndex: number, patch: Partial<NavLink>) => {
    const children = [...(items[itemIndex].children || [])];
    children[childIndex] = { ...children[childIndex], ...patch };
    updateItem(itemIndex, { children });
  };

  const updateColumn = (itemIndex: number, colIndex: number, patch: Partial<NavColumn>) => {
    const mega = items[itemIndex].mega!;
    const columns = [...mega.columns];
    columns[colIndex] = { ...columns[colIndex], ...patch };
    updateItem(itemIndex, { mega: { ...mega, columns } });
  };

  const updateColumnLink = (
    itemIndex: number,
    colIndex: number,
    linkIndex: number,
    patch: Partial<NavLink>
  ) => {
    const mega = items[itemIndex].mega!;
    const columns = [...mega.columns];
    const links = [...columns[colIndex].links];
    links[linkIndex] = { ...links[linkIndex], ...patch };
    columns[colIndex] = { ...columns[colIndex], links };
    updateItem(itemIndex, { mega: { ...mega, columns } });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ header_menu: JSON.stringify(items) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save menu");
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
      <div className="admin-card p-4 bg-sky-50/50 border-sky-100">
        <p className="text-sm text-sky-800">
          Build your header navigation like WordPress — add links, simple dropdowns, or full mega menus.
          Drag order with the arrow buttons.
        </p>
      </div>

      {items.map((item, index) => {
        const type = getMenuType(item);
        const isOpen = expanded === index;

        return (
          <div key={index} className="admin-card overflow-hidden">
            <div
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(isOpen ? null : index)}
            >
              <Menu className="w-4 h-4 text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.label || "Untitled"}</p>
                <p className="text-xs text-gray-400 truncate">{item.href}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize shrink-0">
                {type}
              </span>
              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === items.length - 1}
                  className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-1.5 rounded hover:bg-red-50 text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isOpen && (
              <div className="p-4 pt-0 border-t border-gray-100 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div>
                    <label className="admin-label">Menu Label</label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateItem(index, { label: e.target.value })}
                      className="admin-input"
                      placeholder="e.g. Hairstyles"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Link URL</label>
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) => updateItem(index, { href: e.target.value })}
                      className="admin-input"
                      placeholder="/category/hairstyles"
                    />
                  </div>
                </div>

                <div>
                  <label className="admin-label">Menu Type</label>
                  <div className="flex flex-wrap gap-2">
                    {(["link", "dropdown", "mega"] as MenuType[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setMenuType(index, t)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm font-medium border transition-all",
                          type === t
                            ? "bg-sky-50 border-sky-300 text-sky-700"
                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                        )}
                      >
                        {t === "link" ? "Simple Link" : t === "dropdown" ? "Dropdown" : "Mega Menu"}
                      </button>
                    ))}
                  </div>
                </div>

                {type === "dropdown" && (
                  <div className="space-y-2 pl-1">
                    <label className="admin-label">Dropdown Links</label>
                    {(item.children || []).map((child, ci) => (
                      <div key={ci} className="flex gap-2">
                        <input
                          type="text"
                          value={child.label}
                          onChange={(e) => updateChild(index, ci, { label: e.target.value })}
                          placeholder="Label"
                          className="admin-input flex-1"
                        />
                        <input
                          type="text"
                          value={child.href}
                          onChange={(e) => updateChild(index, ci, { href: e.target.value })}
                          placeholder="/path"
                          className="admin-input flex-1"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateItem(index, {
                              children: item.children!.filter((_, i) => i !== ci),
                            })
                          }
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        updateItem(index, {
                          children: [...(item.children || []), { label: "", href: "" }],
                        })
                      }
                      className="text-sm text-sky-600 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add link
                    </button>
                  </div>
                )}

                {type === "mega" && item.mega && (
                  <div className="space-y-4 border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                    {item.mega.columns.map((col, ci) => (
                      <div key={ci} className="space-y-2">
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={col.title}
                            onChange={(e) => updateColumn(index, ci, { title: e.target.value })}
                            placeholder="Column title"
                            className="admin-input flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const columns = item.mega!.columns.filter((_, i) => i !== ci);
                              updateItem(index, { mega: { ...item.mega!, columns } });
                            }}
                            className="p-2 text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {col.links.map((link, li) => (
                          <div key={li} className="flex gap-2 ml-2">
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) => updateColumnLink(index, ci, li, { label: e.target.value })}
                              placeholder="Label"
                              className="admin-input flex-1 text-sm"
                            />
                            <input
                              type="text"
                              value={link.href}
                              onChange={(e) => updateColumnLink(index, ci, li, { href: e.target.value })}
                              placeholder="/path"
                              className="admin-input flex-1 text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const links = col.links.filter((_, i) => i !== li);
                                updateColumn(index, ci, { links });
                              }}
                              className="p-1.5 text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            updateColumn(index, ci, {
                              links: [...col.links, { label: "", href: "" }],
                            })
                          }
                          className="text-xs text-sky-600 ml-2"
                        >
                          + Add link
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        updateItem(index, {
                          mega: {
                            ...item.mega!,
                            columns: [
                              ...item.mega!.columns,
                              { title: "New Column", links: [{ label: "", href: "" }] },
                            ],
                          },
                        })
                      }
                      className="text-sm text-sky-600 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add column
                    </button>

                    <div className="border-t border-gray-200 pt-4 space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Featured card
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={item.mega.featured.tag}
                          onChange={(e) =>
                            updateItem(index, {
                              mega: {
                                ...item.mega!,
                                featured: { ...item.mega!.featured, tag: e.target.value },
                              },
                            })
                          }
                          placeholder="Tag"
                          className="admin-input"
                        />
                        <input
                          type="text"
                          value={item.mega.featured.href}
                          onChange={(e) =>
                            updateItem(index, {
                              mega: {
                                ...item.mega!,
                                featured: { ...item.mega!.featured, href: e.target.value },
                              },
                            })
                          }
                          placeholder="Link URL"
                          className="admin-input"
                        />
                      </div>
                      <input
                        type="text"
                        value={item.mega.featured.title}
                        onChange={(e) =>
                          updateItem(index, {
                            mega: {
                              ...item.mega!,
                              featured: { ...item.mega!.featured, title: e.target.value },
                            },
                          })
                        }
                        placeholder="Featured title"
                        className="admin-input"
                      />
                      <ImageUploadField
                        label="Featured image"
                        value={item.mega.featured.image}
                        onChange={(url) =>
                          updateItem(index, {
                            mega: {
                              ...item.mega!,
                              featured: { ...item.mega!.featured, image: url },
                            },
                          })
                        }
                        compact
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={addItem}
        className="w-full admin-card p-4 border-2 border-dashed border-gray-200 hover:border-sky-300 hover:bg-sky-50/30 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-sky-700"
      >
        <Plus className="w-4 h-4" /> Add menu item
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          Header menu saved — refresh the public site to see changes
        </div>
      )}

      <button onClick={handleSave} disabled={saving} className="admin-btn-primary flex items-center gap-2">
        <Save className="w-4 h-4" />
        {saving ? "Saving..." : "Save Header Menu"}
      </button>
    </div>
  );
}
