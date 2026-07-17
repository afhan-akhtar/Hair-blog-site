import { NewsletterSignup } from "./NewsletterSignup";

export function NewsletterBanner() {
  return (
    <section className="py-16 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-rose via-peach to-rose rounded-[28px] px-8 md:px-14 py-12 md:py-14 shadow-sm transition-all duration-500 hover:shadow-[0_16px_48px_rgba(197,139,133,0.35)] hover:scale-[1.005]">
        <NewsletterSignup variant="banner" />
      </div>
    </section>
  );
}
