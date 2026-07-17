import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { PostCard } from "@/components/public/PostCard";
import { NewsletterBanner } from "@/components/public/NewsletterBanner";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { prisma } from "@/lib/db";
import { parseContent } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { IMAGES } from "@/lib/images";
import { NewsletterSignup } from "@/components/public/NewsletterSignup";
import Image from "next/image";
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

  const relatedPosts = await prisma.post.findMany({
    where: {
      status: "published",
      id: { not: post.id },
      categoryId: post.categoryId || undefined,
    },
    include: { category: true },
    take: 3,
  });

  return (
    <>
      <div className="bg-plum-dark h-1" />
      <Header />

      <article className="max-w-7xl mx-auto px-6 py-12">
        {/* Article Header */}
        <header className="text-center max-w-3xl mx-auto mb-10">
          {post.category && (
            <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">
              {post.category.name}
            </span>
          )}
          <h1 className="font-serif text-4xl md:text-5xl font-bold mt-4 leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-gray-600 mt-4">{post.excerpt}</p>
          )}
          <div className="flex items-center justify-center gap-3 mt-6">
            {post.author?.avatar && (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div className="text-sm text-gray-600">
              <span className="font-medium text-charcoal">{post.author?.name}</span>
              <span className="mx-2">·</span>
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative aspect-[16/9] max-w-4xl mx-auto rounded-3xl overflow-hidden mb-12">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <BlockRenderer blocks={blocks} />

            {/* Author Bio */}
            {post.author && (
              <div className="bg-beige rounded-2xl p-8 mt-12 flex gap-6 items-start">
                {post.author.avatar && (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={64}
                    height={64}
                    className="rounded-full flex-shrink-0"
                  />
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

          {/* Sidebar */}
          <aside className="space-y-8">
            <NewsletterSignup variant="sidebar" />

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold mb-4">Follow us</h3>
              <div className="space-y-2">
                {["Instagram", "Pinterest", "TikTok"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="block text-sm text-gray-600 hover:text-plum transition-colors"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </article>

      {/* Related Stories */}
      {relatedPosts.length > 0 && (
        <section className="bg-cream-dark py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-3xl font-bold mb-10">Related stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <NewsletterBanner />
      <Footer />
    </>
  );
}
