import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { PostCard } from "@/components/public/PostCard";
import { NewsletterBanner } from "@/components/public/NewsletterBanner";
import { prisma } from "@/lib/db";
import { IMAGES } from "@/lib/images";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take: 6,
  });

  const heroPost = posts[0];
  const secondaryPosts = posts.slice(1, 3);

  const looks = [
    { name: "The Pixie", image: IMAGES.avatar1 },
    { name: "Long Curls", image: IMAGES.avatar2 },
    { name: "The Bob", image: IMAGES.avatar3 },
    { name: "The Shag", image: IMAGES.avatar4 },
    { name: "Beach Waves", image: IMAGES.avatar5 },
    { name: "Sleek Straight", image: IMAGES.avatar6 },
  ];

  const concerns = [
    { title: "Damaged Hair", image: IMAGES.concern1, bg: "bg-rose" },
    { title: "Hair Loss", image: IMAGES.concern2, bg: "bg-blue-50" },
    { title: "Dry Scalp", image: IMAGES.concern3, bg: "bg-amber-50" },
  ];

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {heroPost && (
            <Link href={`/blog/${heroPost.slug}`} className="group relative rounded-2xl overflow-hidden aspect-[3/4] lg:row-span-2">
              <Image
                src={heroPost.featuredImage || IMAGES.heroMain}
                alt={heroPost.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                {heroPost.category && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                    {heroPost.category.name}
                  </span>
                )}
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mt-2 leading-tight">
                  {heroPost.title}
                </h2>
              </div>
            </Link>
          )}

          <div className="flex flex-col gap-6">
            {secondaryPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group relative rounded-2xl overflow-hidden flex-1 min-h-[200px]"
              >
                <Image
                  src={post.featuredImage || IMAGES.heroSecondary1}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {post.category && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                      {post.category.name}
                    </span>
                  )}
                  <h3 className="font-serif text-xl font-bold text-white mt-1 leading-snug">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category Nav */}
      <nav className="border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-8 overflow-x-auto text-sm font-medium text-gray-600">
          {["Styling", "Hair Color", "Braids", "Hair Care", "Tools", "Browse all"].map(
            (cat) => (
              <Link key={cat} href="#" className="whitespace-nowrap hover:text-plum transition-colors">
                {cat}
              </Link>
            )
          )}
        </div>
      </nav>

      {/* Find your next look */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="font-serif text-3xl font-bold mb-10">Find your next look</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
          {looks.map((look) => (
            <Link key={look.name} href="#" className="text-center group">
              <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full overflow-hidden mb-3 ring-2 ring-transparent group-hover:ring-plum transition-all">
                <Image src={look.image} alt={look.name} fill className="object-cover" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-plum transition-colors">
                {look.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Stories */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="font-serif text-3xl font-bold mb-10">Latest stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-plum rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-square md:aspect-auto min-h-[300px]">
            <Image
              src={IMAGES.ctaPortrait}
              alt="Find your shade"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-10 md:p-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight">
              Find a shade that works beyond the salon chair.
            </h2>
            <p className="text-white/70 mt-4 text-lg">
              Take our color quiz and discover your perfect match.
            </p>
            <button className="mt-8 self-start px-8 py-3 bg-white text-plum rounded-full font-medium hover:bg-rose transition-colors">
              Take the color quiz
            </button>
          </div>
        </div>
      </section>

      {/* Hair care by concern */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="font-serif text-3xl font-bold mb-10">Hair care by concern</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {concerns.map((concern) => (
            <Link
              key={concern.title}
              href="#"
              className={`${concern.bg} rounded-2xl overflow-hidden group`}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={concern.image}
                  alt={concern.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold">{concern.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quiz Widget */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold">
              What should you try next?
            </h2>
            <p className="text-gray-600 mt-3">
              Tell us about your hair and we&apos;ll recommend the perfect style.
            </p>
          </div>
          <div className="space-y-4">
            {["I have...", "My hair is...", "I want..."].map((label) => (
              <select
                key={label}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-plum/30"
                defaultValue=""
              >
                <option value="" disabled>
                  {label}
                </option>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
            ))}
            <button className="w-full py-3 bg-plum text-white rounded-lg font-medium hover:bg-plum-dark transition-colors">
              View Results
            </button>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="bg-beige rounded-3xl p-10 md:p-16">
            <blockquote className="font-serif text-3xl md:text-4xl font-bold leading-snug">
              &ldquo;Beauty advice should feel inspiring—and genuinely useful.&rdquo;
            </blockquote>
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
            <Image src={IMAGES.lifestyle} alt="Lifestyle" fill className="object-cover" />
          </div>
        </div>
      </section>

      <NewsletterBanner />
      <Footer />
    </>
  );
}
