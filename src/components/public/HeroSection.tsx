import Link from "next/link";
import { HERO_CONTENT } from "@/lib/images";
import { prisma } from "@/lib/db";
import { HeroMedia } from "./HeroMedia";

function HeroBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-white/95 text-charcoal text-[11px] font-bold uppercase tracking-[0.18em] px-3.5 py-2 rounded-full shadow-sm backdrop-blur-sm">
      {children}
    </span>
  );
}

async function getHeroPosts() {
  const slugs = [
    HERO_CONTENT.main.slug,
    ...HERO_CONTENT.secondary.map((item) => item.slug),
  ];

  const posts = await prisma.post.findMany({
    where: { slug: { in: slugs }, status: "published", deletedAt: null },
    include: { category: true },
  });

  const postBySlug = Object.fromEntries(posts.map((post) => [post.slug, post]));

  const mainPost = postBySlug[HERO_CONTENT.main.slug];
  const main = {
    slug: HERO_CONTENT.main.slug,
    tag: HERO_CONTENT.main.tag,
    title: mainPost?.title ?? HERO_CONTENT.main.title,
    image: mainPost?.featuredImage ?? "",
  };

  const secondary = HERO_CONTENT.secondary.map((item) => {
    const post = postBySlug[item.slug];
    return {
      slug: item.slug,
      tag: post?.category?.name ?? item.tag,
      title: post?.title ?? item.title,
      image: post?.featuredImage ?? "",
    };
  });

  return { main, secondary };
}

export async function HeroSection() {
  const { main, secondary } = await getHeroPosts();

  return (
    <section className="bg-cream">
      <div className="site-container pt-10 pb-10 lg:pt-12 lg:pb-14">
        <p className="text-center text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-terracotta mb-8 lg:mb-10 animate-fade-up">
          Hair &bull; Beauty &bull; Style
        </p>

        <div className="hero-grid">
          <Link
            href={`/blog/${main.slug}`}
            className="hero-card hero-card-main image-zoom-wrap group block cursor-pointer card-hover shadow-[0_12px_48px_rgba(0,0,0,0.1)]"
          >
            <HeroMedia
              src={main.image}
              alt={main.title}
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              position="top"
            />
            <div className="hero-card-overlay hero-card-overlay-main" />
            <div className="hero-card-content">
              <HeroBadge>{main.tag}</HeroBadge>
              <h2 className="font-serif text-[1.85rem] sm:text-[2.35rem] md:text-[2.85rem] lg:text-[3.25rem] xl:text-[3.5rem] font-bold text-white mt-4 lg:mt-5 leading-[1.08] max-w-2xl transition-colors duration-300 group-hover:text-rose/90">
                {main.title}
              </h2>
            </div>
          </Link>

          <div className="hero-side-stack">
            {secondary.map((item, i) => (
              <Link
                key={item.slug}
                href={`/blog/${item.slug}`}
                className="hero-card hero-card-side image-zoom-wrap group block cursor-pointer card-hover shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
              >
                <HeroMedia
                  src={item.image}
                  alt={item.title}
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="hero-card-overlay" />
                <div className="hero-card-content hero-card-content-side">
                  <HeroBadge>{item.tag}</HeroBadge>
                  <h3 className="font-serif text-xl sm:text-2xl lg:text-[1.75rem] xl:text-[1.9rem] font-bold text-white mt-3 leading-snug">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
