interface PageHeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function PageHero({ title, subtitle, badge }: PageHeroProps) {
  return (
    <section className="bg-white border-b border-black/5">
      <div className="site-container py-14 md:py-20 text-center">
        {badge && (
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-terracotta mb-4">
            {badge}
          </span>
        )}
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal leading-tight max-w-3xl mx-auto">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-500 mt-5 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
