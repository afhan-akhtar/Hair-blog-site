import { NewsletterSignup } from "./NewsletterSignup";

export function NewsletterBanner() {
  return (
    <section className="py-16 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-rose via-peach to-rose rounded-[28px] px-8 md:px-14 py-12 md:py-14 shadow-sm">
        <NewsletterSignup variant="banner" />
      </div>
    </section>
  );
}
