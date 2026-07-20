import { prisma } from "@/lib/db";
import { checkSeo } from "@/lib/seo";
import { getSession } from "@/lib/auth";
import { AlertTriangle, FileText, CheckCircle2, Clock, PenLine } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getSession();
  const isCollaborator = session?.role === "collaborator";

  const postWhere = isCollaborator
    ? { status: "draft" as const, authorId: session!.id, deletedAt: null }
    : { status: { not: "trash" as const }, deletedAt: null };

  const [postCount, publishedCount, draftCount, scheduledCount, recentPosts] =
    await Promise.all([
      prisma.post.count({ where: postWhere }),
      isCollaborator
        ? Promise.resolve(0)
        : prisma.post.count({ where: { status: "published" } }),
      prisma.post.count({
        where: isCollaborator
          ? { status: "draft", authorId: session!.id, deletedAt: null }
          : { status: "draft" },
      }),
      isCollaborator
        ? Promise.resolve(0)
        : prisma.post.count({ where: { status: "scheduled" } }),
      prisma.post.findMany({
        where: postWhere,
        include: { category: true, author: true },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
    ]);

  const seoWarnings = recentPosts.filter((post) => {
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
    return seo.warnings.length > 0;
  });

  const stats = [
    {
      label: isCollaborator ? "My Drafts" : "Total Posts",
      value: postCount,
      icon: FileText,
      gradient: "from-blue-500 to-sky-400",
    },
    ...(!isCollaborator
      ? [
          { label: "Published", value: publishedCount, icon: CheckCircle2, gradient: "from-emerald-500 to-green-400" },
          { label: "Drafts", value: draftCount, icon: PenLine, gradient: "from-slate-500 to-gray-400" },
          { label: "Scheduled", value: scheduledCount, icon: Clock, gradient: "from-violet-500 to-purple-400" },
        ]
      : []),
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session?.name?.split(" ")[0]}
        </h1>
        <p className="text-gray-500 mt-1">
          {isCollaborator
            ? "Create and manage your draft posts"
            : "Here's what's happening with your blog today"}
        </p>
      </div>

      <div className={`grid grid-cols-1 ${isCollaborator ? "md:grid-cols-1 max-w-sm" : "md:grid-cols-4"} gap-4 mb-8`}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="admin-stat-card group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!isCollaborator && seoWarnings.length > 0 && (
        <div className="admin-card p-4 mb-6 border-l-4 border-amber-400 bg-amber-50/80">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="font-semibold text-amber-800">SEO Warnings</h3>
          </div>
          <p className="text-sm text-amber-700 mb-2">
            {seoWarnings.length} recent post(s) have missing SEO fields
          </p>
          <ul className="text-sm text-amber-600 space-y-1">
            {seoWarnings.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/posts/${p.id}/edit`} className="hover:underline">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="admin-card overflow-hidden admin-table-wrap">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            {isCollaborator ? "My Recent Drafts" : "Recent Posts"}
          </h2>
          <Link href="/admin/posts/new" className="admin-btn-primary text-sm text-center w-full sm:w-auto">
            Add New
          </Link>
        </div>
        <table className="admin-table w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              {!isCollaborator && <th>Author</th>}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentPosts.map((post) => (
              <tr key={post.id}>
                <td>
                  <Link href={`/admin/posts/${post.id}/edit`} className="text-admin-blue hover:underline font-medium">
                    {post.title}
                  </Link>
                </td>
                <td className="text-gray-600">{post.category?.name || "—"}</td>
                {!isCollaborator && <td className="text-gray-600">{post.author?.name || "—"}</td>}
                <td>
                  <span className="admin-badge capitalize">{post.status}</span>
                </td>
              </tr>
            ))}
            {recentPosts.length === 0 && (
              <tr>
                <td colSpan={isCollaborator ? 3 : 4} className="text-center py-12 text-gray-400">
                  No posts yet. Create your first draft!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
