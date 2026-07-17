import Link from "next/link";
import Image from "next/image";
import { Search, User } from "lucide-react";
import { HERO_CONTENT } from "@/lib/images";

function HeroBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-white text-charcoal text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full">
      {children}
    </span>
  );
}

export function HeroSection() {
  const { main, secondary } = HERO_CONTENT;

  return (
    <section className="bg-cream">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 pt-8 pb-4">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.35em] text-terracotta mb-6">
          Hair &bull; Beauty &bull; Style
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 lg:h-[580px]">
          {/* Main hero — large left card */}
          <Link
            href={`/blog/${main.slug}`}
            className="lg:col-span-7 relative rounded-[24px] overflow-hidden min-h-[480px] lg:min-h-0 lg:h-full group block"
          >
            <Image
              src={main.image}
              alt={main.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9">
              <HeroBadge>{main.tag}</HeroBadge>
              <h2 className="font-serif text-[1.75rem] md:text-[2.25rem] lg:text-[2.5rem] font-bold text-white mt-4 leading-[1.15] max-w-lg">
                {main.title}
              </h2>
            </div>
          </Link>

          {/* Secondary heroes — stacked right */}
          <div className="lg:col-span-5 flex flex-col gap-4 lg:gap-5 lg:h-full">
            {secondary.map((item) => (
              <Link
                key={item.slug}
                href={`/blog/${item.slug}`}
                className="relative flex-1 rounded-[24px] overflow-hidden min-h-[220px] lg:min-h-0 group block"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7">
                  <HeroBadge>{item.tag}</HeroBadge>
                  <h3 className="font-serif text-xl md:text-[1.4rem] font-bold text-white mt-3 leading-snug">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Trending ticker */}
        <div className="mt-6 py-3 border-y border-black/5 overflow-hidden">
          <p className="text-sm text-gray-500 whitespace-nowrap">
            <span className="font-semibold text-charcoal mr-3">Trending:</span>
            New layers &nbsp;&middot;&nbsp; Buzz cuts &nbsp;&middot;&nbsp; Soft curtain bangs &nbsp;&middot;&nbsp; Pixie cuts &nbsp;&middot;&nbsp; Warm brunette &nbsp;&middot;&nbsp; Scalp care &nbsp;&middot;&nbsp; Silk press
          </p>
        </div>
      </div>
    </section>
  );
}
