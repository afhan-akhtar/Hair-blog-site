import { NewsletterSignup } from "./NewsletterSignup";

export function NewsletterBanner() {
  return (
    <section className="bg-rose py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <NewsletterSignup variant="banner" />
      </div>
    </section>
  );
}
