import { prisma } from "@/lib/db";

const publishedWhere = {
  status: "published" as const,
  deletedAt: null,
};

export async function getRelatedPosts(postId: string, categoryId: string | null, limit = 3) {
  if (categoryId) {
    const sameCategory = await prisma.post.findMany({
      where: {
        ...publishedWhere,
        id: { not: postId },
        categoryId,
      },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });

    if (sameCategory.length > 0) {
      return { posts: sameCategory, fromSameCategory: true };
    }
  }

  const posts = await prisma.post.findMany({
    where: {
      ...publishedWhere,
      id: { not: postId },
    },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });

  return { posts, fromSameCategory: false };
}
