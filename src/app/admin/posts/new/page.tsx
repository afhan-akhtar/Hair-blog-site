import { prisma } from "@/lib/db";
import { PostEditor } from "@/components/admin/PostEditor";
import { getSession, canPublish } from "@/lib/auth";

export default async function NewPostPage() {
  const session = await getSession();

  const [categories, users] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <PostEditor
      categories={categories}
      users={users}
      canPublish={canPublish(session?.role || "")}
      currentUserId={session?.id}
    />
  );
}
