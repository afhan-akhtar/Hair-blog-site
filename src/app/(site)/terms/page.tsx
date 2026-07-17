import { PageHero } from "@/components/public/PageHero";
import { SITE } from "@/lib/navigation";

export const metadata = {
  title: `Terms of Use — ${SITE.name}`,
};

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms of Use" subtitle="Last updated: July 2025" />
      <section className="max-w-3xl mx-auto px-5 sm:px-6 py-16">
        <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-3">Acceptance of terms</h2>
            <p className="leading-relaxed">
              By accessing {SITE.name}, you agree to these terms. If you do not agree, please do
              not use our website.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-3">Content disclaimer</h2>
            <p className="leading-relaxed">
              Our articles are for informational purposes only and do not constitute professional
              medical or stylist advice. Always consult a qualified professional for personalized
              recommendations.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-3">Intellectual property</h2>
            <p className="leading-relaxed">
              All content on this site — including text, images, and design — is owned by{" "}
              {SITE.name} unless otherwise credited. Reproduction without permission is prohibited.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-3">Limitation of liability</h2>
            <p className="leading-relaxed">
              {SITE.name} is not liable for any damages arising from the use of information on
              this website. Use our content at your own discretion.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
