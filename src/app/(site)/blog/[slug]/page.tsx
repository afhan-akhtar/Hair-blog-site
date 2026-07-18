import { PostCard } from "@/components/public/PostCard";
import { NewsletterBanner } from "@/components/public/NewsletterBanner";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { prisma } from "@/lib/db";
import { getRelatedPosts } from "@/lib/posts";
import { parseContent } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { NewsletterSignup } from "@/components/public/NewsletterSignup";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      author: true,
    },
  });

  if (!post || post.status !== "published") notFound();

  const blocks = parseContent(post.content);

  const { posts: relatedPosts, fromSameCategory } = await getRelatedPosts(
    post.id,
    post.categoryId,
    3
  );

  return (
    <>
      <article className="max-w-7xl mx-auto px-5 sm:px-6 py-12">
        <header className="text-center max-w-3xl mx-auto mb-10">
          {post.category && (
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-terracotta">
              {post.category.name}
            </span>
          )}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mt-4 leading-[1.08]">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg md:text-xl text-gray-600 mt-5 leading-relaxed">{post.excerpt}</p>
          )}
          <div className="flex items-center justify-center gap-3 mt-6">
            {post.author?.avatar && (
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            )}
            <div className="text-sm text-gray-600">
              <span className="font-medium text-charcoal">{post.author?.name}</span>
              <span className="mx-2">·</span>
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>
        </header>

        {post.featuredImage && (
          <div className="w-full mb-12 md:mb-16 flex items-center justify-center rounded-[28px] overflow-hidden bg-beige">
            <Image
              src={post.featuredImage}
              alt={post.featuredImageAlt || post.title}
              width={1400}
              height={1050}
              className="w-full h-auto object-contain object-center"
              unoptimized={post.featuredImage.startsWith("/uploads")}
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <BlockRenderer blocks={blocks} />

            {post.author && (
              <div className="bg-beige rounded-[20px] p-8 mt-12 flex gap-6 items-start">
                {post.author.avatar && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-serif text-lg font-bold">{post.author.name}</h3>
                  {post.author.bio && (
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                      {post.author.bio}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <NewsletterSignup variant="sidebar" />
            <div className="bg-white rounded-[20px] p-6 border border-black/5">
              <h3 className="font-semibold mb-4 text-sm">Follow us</h3>
              <div className="space-y-2">
                {["Instagram", "Pinterest", "TikTok"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="block text-sm text-gray-600 hover:text-terracotta transition-colors"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="bg-cream py-16 md:py-24 border-t border-black/5">
          <div className="site-container">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-12">
              <div>
                <p className="section-eyebrow mb-3">
                  {fromSameCategory && post.category ? post.category.name : "Keep reading"}
                </p>
                <h2 className="section-heading-sm">
                  {fromSameCategory && post.category
                    ? `More in ${post.category.name}`
                    : "Related stories"}
                </h2>
              </div>
              {fromSameCategory && post.category && (
                <Link
                  href={`/category/${post.category.slug}`}
                  className="link-arrow text-sm font-medium text-plum hover:text-plum-dark"
                >
                  View all →
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {relatedPosts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <NewsletterBanner />
    </>
  );
}
