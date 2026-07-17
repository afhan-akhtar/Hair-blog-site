import { prisma } from "@/lib/db";
import { PostEditor } from "@/components/admin/PostEditor";
import { notFound } from "next/navigation";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [post, categories, users] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!post) notFound();

  const serialized = {
    ...post,
    publishedAt: post.publishedAt?.toISOString() || null,
    scheduledAt: post.scheduledAt?.toISOString() || null,
  };

  return <PostEditor post={serialized} categories={categories} users={users} />;
}
