import { prisma } from "@/lib/db";
import { PostEditor } from "@/components/admin/PostEditor";

export default async function NewPostPage() {
  const [categories, authors] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.author.findMany({ orderBy: { name: "asc" } }),
  ]);

  return <PostEditor categories={categories} authors={authors} />;
}
