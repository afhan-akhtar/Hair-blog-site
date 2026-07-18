import Link from "next/link";
import Image from "next/image";
import { HERO_CONTENT } from "@/lib/images";
import { prisma } from "@/lib/db";

function HeroBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-white/95 text-charcoal text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
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
    image: mainPost?.featuredImage || HERO_CONTENT.main.image,
  };

  const secondary = HERO_CONTENT.secondary.map((item) => {
    const post = postBySlug[item.slug];
    return {
      slug: item.slug,
      tag: post?.category?.name ?? item.tag,
      title: post?.title ?? item.title,
      image: post?.featuredImage || item.image,
    };
  });

  return { main, secondary };
}

export async function HeroSection() {
  const { main, secondary } = await getHeroPosts();

  return (
    <section className="bg-cream">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 pt-8 pb-4">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.35em] text-terracotta mb-6 animate-fade-up">
          Hair &bull; Beauty &bull; Style
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
          <Link
            href={`/blog/${main.slug}`}
            className="image-zoom-wrap lg:col-span-7 relative rounded-[24px] overflow-hidden h-[480px] lg:h-[580px] group block cursor-pointer card-hover shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
          >
            <Image
              src={main.image}
              alt={main.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-top zoom-target"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/85" />
            <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9 transition-transform duration-500 group-hover:-translate-y-1">
              <HeroBadge>{main.tag}</HeroBadge>
              <h2 className="font-serif text-[1.75rem] md:text-[2.25rem] lg:text-[2.5rem] font-bold text-white mt-4 leading-[1.15] max-w-lg transition-colors duration-300 group-hover:text-rose/90">
                {main.title}
              </h2>
            </div>
          </Link>

          <div className="lg:col-span-5 grid grid-rows-2 gap-4 lg:gap-5 h-[460px] lg:h-[580px]">
            {secondary.map((item, i) => (
              <Link
                key={item.slug}
                href={`/blog/${item.slug}`}
                className="image-zoom-wrap relative rounded-[24px] overflow-hidden min-h-[220px] h-full group block cursor-pointer card-hover shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-center zoom-target"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent transition-all duration-500 group-hover:from-black/80" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7 transition-transform duration-500 group-hover:-translate-y-1">
                  <HeroBadge>{item.tag}</HeroBadge>
                  <h3 className="font-serif text-xl md:text-[1.4rem] font-bold text-white mt-3 leading-snug">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 py-3 border-y border-black/5 overflow-hidden">
          <div className="marquee-track">
            {[0, 1].map((n) => (
              <p
                key={n}
                className="text-sm text-gray-500 whitespace-nowrap px-8 flex items-center gap-6"
              >
                <span className="font-semibold text-charcoal">Trending:</span>
                New layers · Buzz cuts · Soft curtain bangs · Pixie cuts · Warm brunette · Scalp care · Silk press · Face-framing layers · Gloss treatments
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
