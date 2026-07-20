"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Pencil, Eye, Copy, Trash2, Search, RotateCcw } from "lucide-react";
import { formatDate, getStatusColor } from "@/lib/utils";
import { checkSeo, getSeoStatusColor, getSeoStatusLabel } from "@/lib/seo";

interface PostRow {
  id: string;
  title: string;
  slug: string;
  featuredImage: string | null;
  status: string;
  seoScore: number;
  publishedAt: string | null;
  scheduledAt: string | null;
  updatedAt: string;
  featuredImageAlt: string | null;
  seoTitle: string | null;
  metaDescription: string | null;
  categoryId: string | null;
  authorId: string | null;
  focusKeyword: string | null;
  content: string;
  category: { name: string } | null;
  author: { name: string } | null;
}

interface PostsTableProps {
  posts: PostRow[];
  categories: { id: string; name: string }[];
  users: { id: string; name: string }[];
  canPublish?: boolean;
}

export function PostsTable({ posts, categories, users, canPublish = true }: PostsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "";
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");

  const updateStatusFilter = (value: string) => {
    setSelected([]);
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("status", value);
    else params.delete("status");
    const query = params.toString();
    router.push(query ? `/admin/posts?${query}` : "/admin/posts");
  };

  const filtered = posts.filter((post) => {
    if (statusFilter === "trash") {
      if (post.status !== "trash") return false;
    } else if (statusFilter) {
      if (post.status !== statusFilter) return false;
    } else {
      if (post.status === "trash") return false;
    }
    if (categoryFilter && post.categoryId !== categoryFilter) return false;
    if (authorFilter && post.authorId !== authorFilter) return false;
    if (search && !post.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map((p) => p.id));
  };

  const toggleOne = (id: string) => {
    setSelected(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  const isTrashView = statusFilter === "trash";

  const handleAction = async (action: string, ids: string[]) => {
    if (!ids.length) return;
    if (action === "delete_permanent") {
      const count = ids.length;
      const message =
        count === 1
          ? "Permanently delete this post? This cannot be undone."
          : `Permanently delete ${count} posts? This cannot be undone.`;
      if (!window.confirm(message)) return;
    }
    await fetch("/api/posts/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, action }),
    });
    setSelected([]);
    router.refresh();
  };

  const handleBulkAction = (action: string) => handleAction(action, selected);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="admin-section-title">Posts</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all blog posts</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-admin-blue text-white rounded-lg text-sm font-medium hover:bg-admin-blue-dark transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New
        </Link>
      </div>

      <div className="admin-card p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-admin-blue/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => updateStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="review">Pending Review</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
          <option value="private">Private</option>
          <option value="trash">Trash</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">All Authors</option>
          {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        {selected.length > 0 && (
          <div className="flex gap-2">
            {isTrashView ? (
              canPublish && (
                <>
                  <button onClick={() => handleBulkAction("restore")} className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">Restore</button>
                  <button onClick={() => handleBulkAction("delete_permanent")} className="px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100">Delete Permanently</button>
                </>
              )
            ) : (
              <>
                {canPublish && (
                  <button onClick={() => handleBulkAction("publish")} className="px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100">Publish</button>
                )}
                {canPublish && (
                  <button onClick={() => handleBulkAction("draft")} className="px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100">Move to Draft</button>
                )}
                <button onClick={() => handleBulkAction("trash")} className="px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100">Trash</button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table w-full">
            <thead>
              <tr>
                <th className="w-10">
                  <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} />
                </th>
                <th>Featured image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Status</th>
                <th>SEO status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => {
                const seo = checkSeo({
                  title: post.title,
                  seoTitle: post.seoTitle,
                  metaDescription: post.metaDescription,
                  featuredImage: post.featuredImage,
                  featuredImageAlt: post.featuredImageAlt,
                  categoryId: post.categoryId,
                  authorId: post.authorId,
                  focusKeyword: post.focusKeyword,
                  content: post.content,
                });
                return (
                  <tr key={post.id}>
                    <td><input type="checkbox" checked={selected.includes(post.id)} onChange={() => toggleOne(post.id)} /></td>
                    <td>
                      {post.featuredImage ? (
                        <div className="relative w-12 h-12 rounded overflow-hidden">
                          <Image src={post.featuredImage} alt="" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded bg-gray-100" />
                      )}
                    </td>
                    <td>
                      <Link href={`/admin/posts/${post.id}/edit`} className="font-medium text-admin-blue hover:underline line-clamp-1 max-w-[200px]">
                        {post.title}
                      </Link>
                    </td>
                    <td className="text-gray-600">{post.category?.name || "—"}</td>
                    <td className="text-gray-600">{post.author?.name || "—"}</td>
                    <td>
                      <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getSeoStatusColor(seo.warnings.length)}`}>
                        {getSeoStatusLabel(seo.warnings.length)} ({seo.score})
                      </span>
                    </td>
                    <td className="text-gray-600 whitespace-nowrap text-sm">
                      {formatDate(post.publishedAt || post.scheduledAt || post.updatedAt)}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        {isTrashView ? (
                          canPublish && (
                            <>
                              <button onClick={() => handleAction("restore", [post.id])} className="p-1.5 rounded hover:bg-blue-50" title="Restore"><RotateCcw className="w-4 h-4 text-blue-500" /></button>
                              <button onClick={() => handleAction("delete_permanent", [post.id])} className="p-1.5 rounded hover:bg-red-50" title="Delete Permanently"><Trash2 className="w-4 h-4 text-red-500" /></button>
                            </>
                          )
                        ) : (
                          <>
                            <Link href={`/admin/posts/${post.id}/edit`} className="p-1.5 rounded hover:bg-gray-100" title="Edit"><Pencil className="w-4 h-4 text-gray-500" /></Link>
                            <Link href={`/blog/${post.slug}`} target="_blank" className="p-1.5 rounded hover:bg-gray-100" title="Preview"><Eye className="w-4 h-4 text-gray-500" /></Link>
                            <button className="p-1.5 rounded hover:bg-gray-100" title="Duplicate"><Copy className="w-4 h-4 text-gray-500" /></button>
                            <button onClick={() => handleAction("trash", [post.id])} className="p-1.5 rounded hover:bg-red-50" title="Trash"><Trash2 className="w-4 h-4 text-red-400" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400">No posts found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
