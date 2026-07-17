import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHero } from "@/components/public/PageHero";
import { StoryCard } from "@/components/public/PostCard";
import { LATEST_STORIES } from "@/lib/images";

const SLUG_TITLES: Record<string, { title: string; description: string }> = {
  hairstyles: { title: "Hairstyles", description: "Cuts, styles, and inspiration for every length and texture." },
  "hair-colors": { title: "Hair Color", description: "Shades, techniques, and color care from root to tip." },
  "hair-care": { title: "Hair Care", description: "Routines, products, and expert advice for healthy hair." },
  haircuts: { title: "Haircuts & Layers", description: "The best cuts and layering techniques for your face shape." },
  "short-hairstyles": { title: "Short Hairstyles", description: "Pixies, bobs, and cropped styles that make a statement." },
  "medium-hairstyles": { title: "Medium Hairstyles", description: "Shoulder-length cuts with movement and versatility." },
  "long-hairstyles": { title: "Long Hairstyles", description: "Layers, waves, and styles that celebrate length." },
  "bobs-pixies": { title: "Bobs & Pixies", description: "Classic and modern short cuts for every face shape." },
  braids: { title: "Braids & Protective Styles", description: "Protective styling that looks beautiful and lasts." },
  "curly-wavy": { title: "Curly & Wavy Hair", description: "Embrace your natural texture with the right techniques." },
  updos: { title: "Updos & Occasion Hair", description: "Elegant styles for weddings, events, and special nights." },
  blonde: { title: "Blonde & Highlights", description: "From sun-kissed balayage to platinum perfection." },
  brunette: { title: "Brunette & Warm Tones", description: "Rich browns, coppers, and dimensional brunette shades." },
  "red-copper": { title: "Red & Copper", description: "Bold reds, auburns, and copper tones that turn heads." },
  "vivid-color": { title: "Bold & Vivid Color", description: "Fashion colors and creative expression." },
  balayage: { title: "Balayage & Ombré", description: "Hand-painted color for natural-looking dimension." },
  "root-touchup": { title: "Root Touch-Ups", description: "Keep your color fresh between salon visits." },
  "gray-blending": { title: "Gray Blending", description: "Seamless techniques for embracing or blending gray." },
  "at-home-color": { title: "At-Home Color", description: "Safe, salon-quality results from your bathroom." },
  "dry-damaged": { title: "Dry & Damaged Hair", description: "Repair routines to restore strength and shine." },
  frizz: { title: "Frizz & Flyaways", description: "Tame unruly hair with the right products and techniques." },
  "scalp-health": { title: "Scalp Health", description: "A healthy scalp is the foundation of great hair." },
  "hair-loss": { title: "Hair Loss & Thinning", description: "Evidence-based approaches to thinning and shedding." },
  "wash-day": { title: "Wash Day Guides", description: "Build the perfect wash day routine for your hair type." },
  "deep-conditioning": { title: "Deep Conditioning", description: "Intensive treatments for thirsty, damaged hair." },
  "heat-protection": { title: "Heat Protection", description: "Style safely without sacrificing hair health." },
  "hair-products": { title: "Hair Products", description: "Honest reviews and recommendations from our editors." },
  styling: { title: "Styling", description: "Techniques and tools for everyday and occasion looks." },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const info = SLUG_TITLES[slug];
  return {
    title: info ? `${info.title} — The Hair Edit` : "Category — The Hair Edit",
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const info = SLUG_TITLES[slug];
  if (!info) notFound();

  const dbPosts = await prisma.post
    .findMany({
      where: {
        status: "published",
        category: { slug },
      },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      take: 9,
    })
    .catch(() => []);

  const hasDbPosts = dbPosts.length > 0;

  return (
    <>
      <PageHero title={info.title} subtitle={info.description} badge="Category" />

      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {hasDbPosts
            ? dbPosts.map((post) => (
                <StoryCard
                  key={post.id}
                  tag={post.category?.name || info.title}
                  title={post.title}
                  excerpt={post.excerpt || ""}
                  date={post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                  slug={post.slug}
                  image={post.featuredImage || ""}
                />
              ))
            : LATEST_STORIES.map((story) => (
                <StoryCard key={story.slug} {...story} />
              ))}
        </div>

        {!hasDbPosts && (
          <p className="text-center text-xs text-gray-400 mt-10">
            Showing featured stories ·{" "}
            <Link href="/" className="text-terracotta hover:underline">
              Back to home
            </Link>
          </p>
        )}
      </section>
    </>
  );
}
