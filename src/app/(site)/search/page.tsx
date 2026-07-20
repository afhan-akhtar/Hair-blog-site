import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHero } from "@/components/public/PageHero";
import { PostCard } from "@/components/public/PostCard";

export const metadata = {
  title: "Search",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const posts = query
    ? await prisma.post.findMany({
        where: {
          status: "published",
          deletedAt: null,
          OR: [
            { title: { contains: query } },
            { excerpt: { contains: query } },
            { focusKeyword: { contains: query } },
          ],
        },
        include: { category: true },
        orderBy: { publishedAt: "desc" },
        take: 24,
      })
    : [];

  return (
    <>
      <PageHero
        badge="Search"
        title={query ? `Results for “${query}”` : "Search stories"}
        subtitle={
          query
            ? `${posts.length} ${posts.length === 1 ? "story" : "stories"} found`
            : "Find hair tips, tutorials, and inspiration across the site."
        }
      />

      <section className="py-16 md:py-20">
        <div className="site-container">
          {!query && (
            <p className="text-gray-500 text-center mb-10">
              Use the search icon in the header to look up articles.
            </p>
          )}

          {query && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {query && posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-6">No stories matched your search.</p>
              <Link
                href="/blog"
                className="inline-flex items-center text-sm font-medium text-plum hover:text-terracotta transition-colors"
              >
                Browse all stories →
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
