"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BlockEditor } from "@/components/admin/BlockEditor";
import { ContentBlock, PostStatus, parseContent } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
}

interface Author {
  id: string;
  name: string;
}

interface PostEditorProps {
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featuredImage: string | null;
    content: string;
    status: string;
    categoryId: string | null;
    authorId: string | null;
    reviewerId: string | null;
    seoScore: number;
  };
  categories: Category[];
  authors: Author[];
}

export function PostEditor({ post, categories, authors }: PostEditorProps) {
  const router = useRouter();
  const isEditing = !!post;

  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || "");
  const [status, setStatus] = useState<PostStatus>(
    (post?.status as PostStatus) || "draft"
  );
  const [categoryId, setCategoryId] = useState(post?.categoryId || "");
  const [authorId, setAuthorId] = useState(post?.authorId || "");
  const [reviewerId, setReviewerId] = useState(post?.reviewerId || "");
  const [blocks, setBlocks] = useState<ContentBlock[]>(
    post ? parseContent(post.content) : []
  );
  const [saving, setSaving] = useState(false);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing) setSlug(slugify(value));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title,
        slug,
        excerpt,
        featuredImage,
        content: blocks,
        status,
        categoryId: categoryId || null,
        authorId: authorId || null,
        reviewerId: reviewerId || null,
      };

      const url = isEditing ? `/api/posts/${post.id}` : "/api/posts";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/admin/posts/${data.id}/edit`);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-[#111] sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/posts"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-sm text-white/50">
            {isEditing ? "Edit Post" : "New Post"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PostStatus)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm capitalize"
          >
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
          <button
            onClick={handleSave}
            disabled={saving || !title}
            className="flex items-center gap-2 px-4 py-2 bg-plum text-white rounded-lg text-sm font-medium hover:bg-plum/80 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="flex-1 overflow-y-auto p-8 max-w-3xl">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Post title"
            className="w-full text-3xl font-bold bg-transparent text-white placeholder:text-white/30 outline-none mb-6"
          />

          <BlockEditor blocks={blocks} onChange={setBlocks} />
        </div>

        {/* Sidebar Settings */}
        <div className="w-80 border-l border-white/10 bg-[#111] overflow-y-auto p-6 space-y-6">
          <div>
            <label className="text-xs uppercase tracking-wider text-white/50 mb-2 block">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-white/50 mb-2 block">
              Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-white/50 mb-2 block">
              Featured Image URL
            </label>
            <input
              type="text"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            />
            {featuredImage && (
              <img
                src={featuredImage}
                alt=""
                className="mt-2 rounded-lg w-full h-32 object-cover"
              />
            )}
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-white/50 mb-2 block">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-white/50 mb-2 block">
              Author
            </label>
            <select
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="">Select author</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-white/50 mb-2 block">
              Reviewer
            </label>
            <select
              value={reviewerId}
              onChange={(e) => setReviewerId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="">Select reviewer</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
