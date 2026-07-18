import { prisma } from "@/lib/db";
import { PageHero } from "@/components/public/PageHero";
import { StoryCard } from "@/components/public/PostCard";
import { SITE } from "@/lib/navigation";

export const metadata = {
  title: `All Stories — ${SITE.name}`,
  description: "The latest hair care, styling, and color stories from our editors.",
};

export default async function BlogIndexPage() {
  const posts = await prisma.post.findMany({
    where: { status: "published", deletedAt: null },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <PageHero
        badge="Stories"
        title="All stories"
        subtitle="Hair care, styling, color, and trend guides from our editors."
      />

      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-16">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {posts.map((post) => (
              <StoryCard
                key={post.id}
                tag={post.category?.name || "Hair"}
                title={post.title}
                excerpt={post.excerpt || ""}
                date={
                  post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : ""
                }
                slug={post.slug}
                image={post.featuredImage || ""}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-16">No stories published yet.</p>
        )}
      </section>
    </>
  );
}
