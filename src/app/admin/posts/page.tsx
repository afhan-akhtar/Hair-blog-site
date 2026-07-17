import { prisma } from "@/lib/db";
import { formatDate, getSeoScoreColor, getStatusColor } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Eye, Copy, Trash2 } from "lucide-react";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    include: { category: true, author: true, reviewer: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Post Management</h1>
          <p className="text-white/50 text-sm mt-1">
            Manage all your blog posts, drafts, and scheduled content.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-plum text-white rounded-lg text-sm font-medium hover:bg-plum/80 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/60">
                <th className="text-left p-4 font-medium">Title</th>
                <th className="text-left p-4 font-medium">Featured image</th>
                <th className="text-left p-4 font-medium">Category</th>
                <th className="text-left p-4 font-medium">Author</th>
                <th className="text-left p-4 font-medium">Reviewer</th>
                <th className="text-left p-4 font-medium">SEO score</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Publish date</th>
                <th className="text-left p-4 font-medium">Updated date</th>
                <th className="text-left p-4 font-medium">Traffic</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="font-medium hover:text-plum transition-colors line-clamp-1 max-w-[200px]"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="p-4">
                    {post.featuredImage ? (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                        <Image
                          src={post.featuredImage}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-white/10" />
                    )}
                  </td>
                  <td className="p-4 text-white/70">
                    {post.category?.name || "—"}
                  </td>
                  <td className="p-4 text-white/70">
                    {post.author?.name || "—"}
                  </td>
                  <td className="p-4 text-white/70">
                    {post.reviewer?.name || "—"}
                  </td>
                  <td className="p-4">
                    <span className={`font-medium ${getSeoScoreColor(post.seoScore)}`}>
                      {post.seoScore}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full capitalize ${getStatusColor(post.status)}`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4 text-white/70 whitespace-nowrap">
                    {formatDate(post.publishedAt)}
                  </td>
                  <td className="p-4 text-white/70 whitespace-nowrap">
                    {formatDate(post.updatedAt)}
                  </td>
                  <td className="p-4 text-white/70">
                    {post.traffic.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="p-1.5 rounded hover:bg-white/10 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="p-1.5 rounded hover:bg-white/10 transition-colors"
                        title="Preview"
                        target="_blank"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-1.5 rounded hover:bg-white/10 transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 rounded hover:bg-white/10 transition-colors text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
