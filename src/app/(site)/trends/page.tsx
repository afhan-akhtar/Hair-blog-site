import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/public/PageHero";
import { IMAGES } from "@/lib/images";
import { SITE } from "@/lib/navigation";

export const metadata = {
  title: `Trends — ${SITE.name}`,
  description: "The latest hair trends, cuts, colors, and styling ideas for 2025.",
};

const TRENDS = [
  {
    tag: "Cut",
    title: "Soft curtain bangs are everywhere",
    excerpt: "The face-framing fringe that works on almost every hair type.",
    image: IMAGES.heroMain,
    slug: "soft-layered-haircuts",
  },
  {
    tag: "Color",
    title: "Expensive-looking warm brunette",
    excerpt: "Rich, dimensional brown tones that look salon-fresh for weeks.",
    image: IMAGES.heroSecondary1,
    slug: "warm-brunette-shades",
  },
  {
    tag: "Care",
    title: "Scalp care is the new skincare",
    excerpt: "Why your routine should start at the root, not the ends.",
    image: IMAGES.concern2,
    slug: "repair-damaged-hair",
  },
  {
    tag: "Style",
    title: "Slick-back buns for every occasion",
    excerpt: "From office-ready to red carpet — one style, endless variations.",
    image: IMAGES.heroSecondary2,
    slug: "synthetic-hair-guide",
  },
  {
    tag: "Texture",
    title: "Beach waves without the damage",
    excerpt: "Heat-free methods for effortless, tousled texture.",
    image: IMAGES.story2,
    slug: "leave-in-conditioners-curly",
  },
  {
    tag: "Color",
    title: "Cherry cola hair is having a moment",
    excerpt: "The deep red-brown shade taking over social media.",
    image: IMAGES.story3,
    slug: "balayage-vs-highlights",
  },
];

export default function TrendsPage() {
  return (
    <>
      <PageHero
        badge="Trends"
        title="What's trending in hair right now"
        subtitle="The cuts, colors, and care routines everyone's talking about this season."
      />

      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TRENDS.map((trend, i) => (
            <Link
              key={trend.slug}
              href={`/blog/${trend.slug}`}
              className="group block"
            >
              <div className="relative aspect-[4/3] rounded-[20px] overflow-hidden mb-5">
                <Image
                  src={trend.image}
                  alt={trend.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  priority={i < 3}
                />
                <span className="absolute top-4 left-4 bg-white text-charcoal text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {trend.tag}
                </span>
              </div>
              <h2 className="font-serif text-xl font-bold group-hover:text-terracotta transition-colors leading-snug">
                {trend.title}
              </h2>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{trend.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
