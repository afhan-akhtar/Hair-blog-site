import { prisma } from "@/lib/db";
import { PostEditor } from "@/components/admin/PostEditor";
import { notFound } from "next/navigation";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [post, categories, authors] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.author.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!post) notFound();

  return <PostEditor post={post} categories={categories} authors={authors} />;
}
