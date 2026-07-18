import { NewsletterSignup } from "./NewsletterSignup";

export function NewsletterBanner() {
  return (
    <section className="py-16 md:py-24">
      <div className="site-container">
        <div className="w-full bg-gradient-to-br from-rose via-peach to-rose rounded-[28px] px-6 py-10 sm:px-10 sm:py-12 md:px-14 md:py-14 lg:px-16 shadow-sm transition-shadow duration-500 hover:shadow-[0_16px_48px_rgba(197,139,133,0.28)]">
          <NewsletterSignup variant="banner" />
        </div>
      </div>
    </section>
  );
}
