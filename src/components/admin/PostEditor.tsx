"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BlockEditor } from "@/components/admin/BlockEditor";
import { ContentBlock, PostStatus, PostVisibility, SchemaType, parseContent, parseTags } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { checkSeo } from "@/lib/seo";
import { Save, ArrowLeft, Eye, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface Category { id: string; name: string; }
interface User { id: string; name: string; role: string; }

interface PostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  featuredImageAlt: string | null;
  featuredImageTitle: string | null;
  featuredImageCaption: string | null;
  featuredImageCredit: string | null;
  content: string;
  status: string;
  visibility: string;
  tags: string;
  focusKeyword: string | null;
  seoTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  robots: string;
  breadcrumbTitle: string | null;
  inSitemap: boolean;
  socialTitle: string | null;
  socialDescription: string | null;
  socialImage: string | null;
  pinterestImage: string | null;
  schemaType: string;
  categoryId: string | null;
  authorId: string | null;
  publishedAt: string | null;
  scheduledAt: string | null;
}

interface PostEditorProps {
  post?: PostData;
  categories: Category[];
  users: User[];
  canPublish?: boolean;
  currentUserId?: string;
}

type SidebarSection = "publishing" | "organization" | "featured" | "seo" | "social" | "schema";

export function PostEditor({ post, categories, users, canPublish = true, currentUserId }: PostEditorProps) {
  const router = useRouter();
  const isEditing = !!post;

  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || "");
  const [featuredImageAlt, setFeaturedImageAlt] = useState(post?.featuredImageAlt || "");
  const [featuredImageTitle, setFeaturedImageTitle] = useState(post?.featuredImageTitle || "");
  const [featuredImageCaption, setFeaturedImageCaption] = useState(post?.featuredImageCaption || "");
  const [featuredImageCredit, setFeaturedImageCredit] = useState(post?.featuredImageCredit || "");
  const [status, setStatus] = useState<PostStatus>((post?.status as PostStatus) || "draft");
  const [visibility, setVisibility] = useState<PostVisibility>((post?.visibility as PostVisibility) || "public");
  const [categoryId, setCategoryId] = useState(post?.categoryId || "");
  const [authorId, setAuthorId] = useState(post?.authorId || currentUserId || "");
  const [tags, setTags] = useState(parseTags(post?.tags || "[]").join(", "));
  const [focusKeyword, setFocusKeyword] = useState(post?.focusKeyword || "");
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle || "");
  const [metaDescription, setMetaDescription] = useState(post?.metaDescription || "");
  const [canonicalUrl, setCanonicalUrl] = useState(post?.canonicalUrl || "");
  const [robots, setRobots] = useState(post?.robots || "index,follow");
  const [breadcrumbTitle, setBreadcrumbTitle] = useState(post?.breadcrumbTitle || "");
  const [inSitemap, setInSitemap] = useState(post?.inSitemap ?? true);
  const [socialTitle, setSocialTitle] = useState(post?.socialTitle || "");
  const [socialDescription, setSocialDescription] = useState(post?.socialDescription || "");
  const [socialImage, setSocialImage] = useState(post?.socialImage || "");
  const [pinterestImage, setPinterestImage] = useState(post?.pinterestImage || "");
  const [schemaType, setSchemaType] = useState<SchemaType>((post?.schemaType as SchemaType) || "article");
  const [scheduledAt, setScheduledAt] = useState(
    post?.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : ""
  );
  const [blocks, setBlocks] = useState<ContentBlock[]>(
    post ? parseContent(post.content) : []
  );
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<SidebarSection>("publishing");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const seoCheck = checkSeo({
    title, seoTitle, metaDescription, featuredImage, featuredImageAlt,
    categoryId, authorId, focusKeyword,
    content: JSON.stringify(blocks),
  });

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing) setSlug(slugify(value));
    if (!seoTitle) setSeoTitle(value);
  };

  const handleSave = useCallback(async (saveStatus?: PostStatus) => {
    setSaving(true);
    try {
      const effectiveStatus = canPublish ? (saveStatus || status) : "draft";
      const payload = {
        title, slug, excerpt, featuredImage,
        featuredImageAlt, featuredImageTitle, featuredImageCaption, featuredImageCredit,
        content: blocks,
        status: effectiveStatus,
        visibility,
        categoryId: categoryId || null,
        authorId: authorId || null,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        focusKeyword, seoTitle, metaDescription, canonicalUrl, robots,
        breadcrumbTitle, inSitemap,
        socialTitle, socialDescription, socialImage, pinterestImage,
        schemaType, scheduledAt: scheduledAt || null,
        seoScore: seoCheck.score,
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
        setLastSaved(new Date());
        if (!isEditing) router.push(`/admin/posts/${data.id}/edit`);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }, [title, slug, excerpt, featuredImage, featuredImageAlt, featuredImageTitle,
    featuredImageCaption, featuredImageCredit, blocks, status, visibility,
    categoryId, authorId, tags, focusKeyword, seoTitle, metaDescription,
    canonicalUrl, robots, breadcrumbTitle, inSitemap, socialTitle,
    socialDescription, socialImage, pinterestImage, schemaType, scheduledAt,
    seoCheck.score, isEditing, post, router, canPublish, status]);

  const sidebarSections: { key: SidebarSection; label: string }[] = [
    { key: "publishing", label: "Publishing" },
    { key: "organization", label: "Organization" },
    { key: "featured", label: "Featured Image" },
    { key: "seo", label: "SEO" },
    { key: "social", label: "Social" },
    { key: "schema", label: "Schema" },
  ];

  const inputClass = "w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-admin-blue/30 focus:border-admin-blue";
  const labelClass = "text-xs uppercase tracking-wider text-gray-500 mb-1.5 block font-medium";

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/admin/posts" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </Link>
          <span className="text-sm text-gray-500">{isEditing ? "Edit Post" : "Add New Post"}</span>
          {lastSaved && (
            <span className="text-xs text-green-600">Saved {lastSaved.toLocaleTimeString()}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isEditing && (
            <Link
              href={`/blog/${slug}`}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" /> Preview
            </Link>
          )}
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="admin-btn-secondary"
          >
            Save Draft
          </button>
          {canPublish && (
            <button
              onClick={() => handleSave("published")}
              disabled={saving || !title}
              className="admin-btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : status === "published" ? "Update" : "Publish"}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Post title"
            className="w-full text-3xl font-bold bg-transparent placeholder:text-gray-300 outline-none mb-2 font-serif"
          />
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="url-slug"
            className="w-full text-sm text-gray-400 bg-transparent outline-none mb-6"
          />
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Write an excerpt..."
            rows={2}
            className="w-full text-gray-600 bg-gray-50 rounded-lg p-3 text-sm outline-none mb-8 resize-none border border-gray-100"
          />
          <BlockEditor blocks={blocks} onChange={setBlocks} />
        </div>

        <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto">
          <div className="flex flex-wrap border-b border-gray-200 bg-white">
            {sidebarSections.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`px-3 py-2.5 text-xs font-medium transition-colors ${
                  activeSection === s.key
                    ? "text-admin-blue border-b-2 border-admin-blue"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-4">
            {activeSection === "publishing" && (
              <>
                {canPublish ? (
                  <>
                    <div>
                      <label className={labelClass}>Status</label>
                      <select value={status} onChange={(e) => setStatus(e.target.value as PostStatus)} className={inputClass}>
                        <option value="draft">Draft</option>
                        <option value="review">Pending Review</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="published">Published</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Visibility</label>
                      <select value={visibility} onChange={(e) => setVisibility(e.target.value as PostVisibility)} className={inputClass}>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                    {status === "scheduled" && (
                      <div>
                        <label className={labelClass}>Schedule Date</label>
                        <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className={inputClass} />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-sky-50 border border-sky-100 rounded-lg p-3 text-sm text-sky-700">
                    This post will be saved as a <strong>draft</strong>. An administrator will publish it.
                  </div>
                )}
              </>
            )}

            {activeSection === "organization" && (
              <>
                <div>
                  <label className={labelClass}>Primary Category</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputClass}>
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Tags</label>
                  <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tag1, tag2, tag3" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Author</label>
                  {canPublish ? (
                    <select value={authorId} onChange={(e) => setAuthorId(e.target.value)} className={inputClass}>
                      <option value="">Select author</option>
                      {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-600 py-2">{users.find((u) => u.id === authorId)?.name || "You"}</p>
                  )}
                </div>
              </>
            )}

            {activeSection === "featured" && (
              <>
                <div>
                  <label className={labelClass}>Image URL</label>
                  <input type="text" value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} className={inputClass} />
                </div>
                {featuredImage && <img src={featuredImage} alt="" className="rounded-lg w-full h-32 object-cover" />}
                <div>
                  <label className={labelClass}>Alt Text</label>
                  <input type="text" value={featuredImageAlt} onChange={(e) => setFeaturedImageAlt(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Title</label>
                  <input type="text" value={featuredImageTitle} onChange={(e) => setFeaturedImageTitle(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Caption</label>
                  <input type="text" value={featuredImageCaption} onChange={(e) => setFeaturedImageCaption(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Image Credit</label>
                  <input type="text" value={featuredImageCredit} onChange={(e) => setFeaturedImageCredit(e.target.value)} className={inputClass} />
                </div>
              </>
            )}

            {activeSection === "seo" && (
              <>
                <div className="bg-white rounded-lg border border-gray-200 p-3 mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">SEO Score: {seoCheck.score}/100</span>
                    {seoCheck.warnings.length > 0 && (
                      <span className="flex items-center gap-1 text-xs text-amber-600">
                        <AlertTriangle className="w-3 h-3" /> {seoCheck.warnings.length} warnings
                      </span>
                    )}
                  </div>
                  {seoCheck.warnings.map((w) => (
                    <p key={w} className="text-xs text-amber-600 mb-1">• {w}</p>
                  ))}
                </div>
                <div>
                  <label className={labelClass}>Focus Keyword</label>
                  <input type="text" value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>SEO Title ({seoTitle.length}/60)</label>
                  <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Meta Description ({metaDescription.length}/160)</label>
                  <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} className={`${inputClass} resize-none`} />
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <p className="text-xs text-gray-400 mb-1">Google Preview</p>
                  <p className="text-blue-700 text-sm font-medium truncate">{seoTitle || title || "Post Title"}</p>
                  <p className="text-green-700 text-xs truncate">hairclub.com/blog/{slug || "post-slug"}</p>
                  <p className="text-gray-600 text-xs line-clamp-2 mt-1">{metaDescription || excerpt || "Meta description preview..."}</p>
                </div>
                <div>
                  <label className={labelClass}>Canonical URL</label>
                  <input type="text" value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} placeholder="/blog/slug" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Robots</label>
                  <select value={robots} onChange={(e) => setRobots(e.target.value)} className={inputClass}>
                    <option value="index,follow">Index, Follow</option>
                    <option value="noindex,follow">Noindex, Follow</option>
                    <option value="index,nofollow">Index, Nofollow</option>
                    <option value="noindex,nofollow">Noindex, Nofollow</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Breadcrumb Title</label>
                  <input type="text" value={breadcrumbTitle} onChange={(e) => setBreadcrumbTitle(e.target.value)} className={inputClass} />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={inSitemap} onChange={(e) => setInSitemap(e.target.checked)} className="rounded" />
                  Include in XML sitemap
                </label>
              </>
            )}

            {activeSection === "social" && (
              <>
                <div>
                  <label className={labelClass}>Social Title</label>
                  <input type="text" value={socialTitle} onChange={(e) => setSocialTitle(e.target.value)} placeholder="Defaults to SEO title" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Social Description</label>
                  <textarea value={socialDescription} onChange={(e) => setSocialDescription(e.target.value)} rows={3} className={`${inputClass} resize-none`} />
                </div>
                <div>
                  <label className={labelClass}>Social Image URL</label>
                  <input type="text" value={socialImage} onChange={(e) => setSocialImage(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Pinterest Image URL</label>
                  <input type="text" value={pinterestImage} onChange={(e) => setPinterestImage(e.target.value)} className={inputClass} />
                </div>
              </>
            )}

            {activeSection === "schema" && (
              <div>
                <label className={labelClass}>Schema Type</label>
                <select value={schemaType} onChange={(e) => setSchemaType(e.target.value as SchemaType)} className={inputClass}>
                  <option value="article">Article / BlogPosting</option>
                  <option value="howto">HowTo</option>
                  <option value="faq">FAQ</option>
                  <option value="productReview">Product Review</option>
                  <option value="none">None</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
