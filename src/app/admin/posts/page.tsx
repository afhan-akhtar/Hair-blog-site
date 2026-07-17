import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { getSession, canPublish } from "@/lib/auth";
import { PostsTable } from "@/components/admin/PostsTable";

export default async function PostsPage() {
  const session = await getSession();
  const isCollaborator = session?.role === "collaborator";

  const postWhere = isCollaborator
    ? { authorId: session!.id, status: "draft" as const }
    : {};

  const [posts, categories, users] = await Promise.all([
    prisma.post.findMany({
      where: postWhere,
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
    <div className="p-6 lg:p-8">
      <Suspense fallback={<div>Loading...</div>}>
        <PostsTable
          posts={serialized}
          categories={categories}
          users={users}
          canPublish={canPublish(session?.role || "")}
        />
      </Suspense>
    </div>
  );
}
