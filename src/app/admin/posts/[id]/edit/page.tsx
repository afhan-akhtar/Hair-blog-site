import { prisma } from "@/lib/db";
import { PostEditor } from "@/components/admin/PostEditor";
import { getSession, canPublish } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  const { id } = await params;

  const [post, categories, users] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!post) notFound();

  if (
    session?.role === "collaborator" &&
    (post.status !== "draft" || post.authorId !== session.id)
  ) {
    redirect("/admin/posts");
  }

  const serialized = {
    ...post,
    publishedAt: post.publishedAt?.toISOString() || null,
    scheduledAt: post.scheduledAt?.toISOString() || null,
  };

  return (
    <PostEditor
      post={serialized}
      categories={categories}
      users={users}
      canPublish={canPublish(session?.role || "")}
      currentUserId={session?.id}
    />
  );
}
