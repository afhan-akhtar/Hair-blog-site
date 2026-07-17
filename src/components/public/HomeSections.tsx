import Image from "next/image";
import Link from "next/link";
import { LOOKS, CONCERNS, LATEST_STORIES, IMAGES } from "@/lib/images";
import { StoryCard } from "./PostCard";

export function QuizWidget() {
  const fields = [
    { label: "Goal", options: ["More volume", "Less frizz", "New color", "Healthy growth"] },
    { label: "Hair Type", options: ["Straight", "Wavy", "Curly", "Coily"] },
    { label: "Hair Length", options: ["Short", "Medium", "Long"] },
    { label: "Hair Texture", options: ["Fine", "Medium", "Thick"] },
  ];

  return (
    <section className="py-16 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[28px] shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-black/5 p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center transition-shadow duration-500 hover:shadow-[0_16px_56px_rgba(93,58,66,0.1)]">
          <div>
            <h2 className="font-serif text-3xl md:text-[2.1rem] font-bold leading-tight">
              What should you try next?
            </h2>
            <p className="text-gray-500 mt-4 leading-relaxed">
              Tell us about your hair goals and we&apos;ll recommend products and
              styles tailored just for you.
            </p>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {fields.map((field) => (
                <select
                  key={field.label}
                  defaultValue=""
                  className="w-full px-4 py-3.5 rounded-xl border border-black/10 text-sm bg-cream text-gray-700 focus:outline-none focus:ring-2 focus:ring-plum/20 appearance-none cursor-pointer"
                >
                  <option value="" disabled>
                    {field.label}
                  </option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ))}
            </div>
            <button className="w-full py-4 bg-terracotta text-white rounded-xl font-semibold text-sm btn-lift hover:bg-plum">
              Find My Match
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LooksSection() {
  return (
    <section className="py-16 px-5 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-[2.1rem] font-bold">
          Find your next look
        </h2>
        <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm leading-relaxed">
          Browse by style to discover cuts, colors, and inspiration that fit your vibe.
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 md:gap-8 mt-12">
          {LOOKS.map((look) => (
            <Link key={look.name} href="#" className="group text-center cursor-pointer">
              <div className="w-[72px] h-[72px] md:w-[88px] md:h-[88px] mx-auto rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-terracotta/50 transition-all duration-500 shadow-md group-hover:shadow-lg group-hover:scale-110">
                <Image
                  src={look.image}
                  alt={look.name}
                  width={88}
                  height={88}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <span className="block text-xs md:text-sm font-medium text-gray-600 mt-3 transition-all duration-300 group-hover:text-plum group-hover:-translate-y-0.5">
                {look.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ConcernsSection() {
  return (
    <section className="py-16 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-serif text-3xl md:text-[2.1rem] font-bold">
            Hair care by concern
          </h2>
          <Link
            href="#"
            className="link-arrow text-sm font-medium text-plum hover:text-plum-dark hidden sm:block"
          >
            View all concerns →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONCERNS.map((concern) => (
            <Link key={concern.title} href="#" className="group block cursor-pointer card-hover rounded-[20px] p-2 -m-2">
              <div className="image-zoom-wrap relative aspect-[4/3] rounded-[20px] overflow-hidden mb-4 shadow-sm">
                <Image
                  src={concern.image}
                  alt={concern.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover zoom-target"
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-plum">
                {concern.tag}
              </span>
              <h3 className="font-serif text-xl font-bold mt-2 group-hover:text-plum transition-colors">
                {concern.title}
              </h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{concern.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBanner() {
  return (
    <section className="py-8 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-[28px] overflow-hidden grid grid-cols-1 md:grid-cols-2 bg-plum shadow-lg transition-shadow duration-500 hover:shadow-[0_24px_64px_rgba(93,58,66,0.35)]">
          <div className="image-zoom-wrap relative aspect-[4/5] md:aspect-auto md:min-h-[400px]">
            <Image
              src={IMAGES.ctaPortrait}
              alt="Find your shade"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top zoom-target"
            />
          </div>
          <div className="flex flex-col justify-center p-10 md:p-14 lg:p-16">
            <h2 className="font-serif text-3xl md:text-[2.25rem] font-bold text-white leading-tight">
              Find a shade that works beyond the salon chair.
            </h2>
            <p className="text-white/65 mt-5 text-base leading-relaxed">
              Take our personalized hair color quiz to find your perfect match.
            </p>
            <button
              type="button"
              className="mt-8 self-start px-8 py-3.5 bg-white text-plum rounded-full font-semibold text-sm btn-lift hover:bg-rose cursor-pointer"
            >
              The Hair Color Quiz
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function QuoteSection() {
  return (
    <section className="py-16 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-[28px] overflow-hidden shadow-sm transition-shadow duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]">
          <div className="bg-white p-10 md:p-14 lg:p-16 flex flex-col justify-center">
            <blockquote className="font-serif text-2xl md:text-3xl lg:text-[2.1rem] font-bold leading-snug text-charcoal">
              &ldquo;Beauty advice should feel inspiring—and genuinely useful.&rdquo;
            </blockquote>
            <p className="text-sm text-gray-500 mt-8 leading-relaxed max-w-sm">
              We believe great hair content should empower you to make confident
              choices — at home and in the salon.
            </p>
            <p className="text-sm font-semibold text-charcoal mt-6">
              Ashley — Editor in Chief
            </p>
          </div>
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[360px]">
            <Image
              src={IMAGES.lifestyle}
              alt="Lifestyle flat lay"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function LatestStoriesSection() {
  return (
    <section className="py-16 px-5 sm:px-6 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-serif text-3xl md:text-[2.1rem] font-bold">
            Latest stories
          </h2>
          <Link
            href="#"
            className="link-arrow text-sm font-medium text-plum hover:text-plum-dark"
          >
            View all stories →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {LATEST_STORIES.map((story) => (
            <StoryCard key={story.slug} {...story} />
          ))}
        </div>
      </div>
    </section>
  );
}
