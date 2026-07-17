import { prisma } from "@/lib/db";
import { FileText, Eye, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const [postCount, publishedCount, totalTraffic, authorCount] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "published" } }),
    prisma.post.aggregate({ _sum: { traffic: true } }),
    prisma.author.count(),
  ]);

  const recentPosts = await prisma.post.findMany({
    include: { category: true, author: true },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "Total Posts", value: postCount, icon: FileText, color: "text-blue-400" },
    { label: "Published", value: publishedCount, icon: Eye, color: "text-green-400" },
    { label: "Total Traffic", value: (totalTraffic._sum.traffic || 0).toLocaleString(), icon: TrendingUp, color: "text-purple-400" },
    { label: "Authors", value: authorCount, icon: Users, color: "text-orange-400" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-white/60">{stat.label}</span>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold">Recent Posts</h2>
          <Link
            href="/admin/posts/new"
            className="px-4 py-2 bg-plum text-white rounded-lg text-sm font-medium hover:bg-plum/80 transition-colors"
          >
            New Post
          </Link>
        </div>
        <div className="divide-y divide-white/10">
          {recentPosts.map((post) => (
            <Link
              key={post.id}
              href={`/admin/posts/${post.id}/edit`}
              className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
              <div>
                <p className="font-medium">{post.title}</p>
                <p className="text-sm text-white/50 mt-1">
                  {post.author?.name} · {post.category?.name || "Uncategorized"}
                </p>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full capitalize ${
                  post.status === "published"
                    ? "bg-green-500/20 text-green-400"
                    : post.status === "review"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {post.status}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
