import { prisma } from "@/lib/db";
import { PostEditor } from "@/components/admin/PostEditor";

export default async function NewPostPage() {
  const [categories, users] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
  ]);

  return <PostEditor categories={categories} users={users} />;
}
