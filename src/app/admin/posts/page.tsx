import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { PostsTable } from "@/components/admin/PostsTable";

export default async function PostsPage() {
  const [posts, categories, users] = await Promise.all([
    prisma.post.findMany({
      include: { category: true, author: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
  ]);

  const serialized = posts.map((p) => ({
    ...p,
    publishedAt: p.publishedAt?.toISOString() || null,
    scheduledAt: p.scheduledAt?.toISOString() || null,
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="p-6">
      <Suspense fallback={<div>Loading...</div>}>
        <PostsTable posts={serialized} categories={categories} users={users} />
      </Suspense>
    </div>
  );
}
