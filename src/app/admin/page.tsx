import { prisma } from "@/lib/db";
import { checkSeo } from "@/lib/seo";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const [postCount, publishedCount, draftCount, scheduledCount, recentPosts] =
    await Promise.all([
      prisma.post.count({ where: { status: { not: "trash" } } }),
      prisma.post.count({ where: { status: "published" } }),
      prisma.post.count({ where: { status: "draft" } }),
      prisma.post.count({ where: { status: "scheduled" } }),
      prisma.post.findMany({
        where: { status: { not: "trash" } },
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
    { label: "Total Posts", value: postCount, color: "text-admin-blue" },
    { label: "Published", value: publishedCount, color: "text-green-600" },
    { label: "Drafts", value: draftCount, color: "text-gray-600" },
    { label: "Scheduled", value: scheduledCount, color: "text-blue-600" },
  ];

  return (
    <div className="p-6">
      <h1 className="admin-section-title mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-card p-5">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {seoWarnings.length > 0 && (
        <div className="admin-card p-4 mb-6 border-l-4 border-amber-400 bg-amber-50">
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

      <div className="admin-card">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="font-semibold">Recent Posts</h2>
          <Link href="/admin/posts/new" className="px-4 py-2 bg-admin-blue text-white rounded-lg text-sm font-medium hover:bg-admin-blue-dark">
            Add New
          </Link>
        </div>
        <table className="admin-table w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Author</th>
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
                <td className="text-gray-600">{post.author?.name || "—"}</td>
                <td>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 capitalize">{post.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
