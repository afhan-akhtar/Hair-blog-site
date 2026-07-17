import { PageHero } from "@/components/public/PageHero";
import { SITE } from "@/lib/navigation";

export const metadata = {
  title: `Privacy Policy — ${SITE.name}`,
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" subtitle="Last updated: July 2025" />
      <section className="max-w-3xl mx-auto px-5 sm:px-6 py-16">
        <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-3">Information we collect</h2>
            <p className="leading-relaxed">
              When you subscribe to our newsletter or contact us, we collect your name and email
              address. We also collect standard analytics data (pages visited, browser type) to
              improve our content.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-3">How we use your data</h2>
            <p className="leading-relaxed">
              We use your information to send newsletters you&apos;ve opted into, respond to
              inquiries, and improve our website. We never sell your personal data to third parties.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-3">Cookies</h2>
            <p className="leading-relaxed">
              We use essential cookies for site functionality and analytics cookies to understand
              how readers use our content. You can disable cookies in your browser settings.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-3">Your rights</h2>
            <p className="leading-relaxed">
              You may request access to, correction of, or deletion of your personal data at any
              time by contacting us at hello@thehairedit.com.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
