import { PageHero } from "@/components/public/PageHero";
import { FaqItem } from "@/components/public/FaqItem";
import { SITE } from "@/lib/navigation";

export const metadata = {
  title: `FAQ — ${SITE.name}`,
};

const FAQS = [
  {
    q: "How often do you publish new articles?",
    a: "We publish 3–5 new guides every week, covering hairstyles, color, care, and trends.",
  },
  {
    q: "Are your articles reviewed by experts?",
    a: "Yes. Hair care and scalp health content is reviewed by board-certified dermatologists. Styling and color guides are reviewed by licensed professionals.",
  },
  {
    q: "Can I submit a story or guest post?",
    a: "We welcome editorial pitches from qualified writers and stylists. Visit our Contact page and select 'Editorial pitch' as your topic.",
  },
  {
    q: "Do you accept product samples for review?",
    a: "We occasionally test products for editorial coverage. Samples never influence our recommendations — we only feature what we'd genuinely recommend.",
  },
  {
    q: "How do I unsubscribe from the newsletter?",
    a: "Every newsletter email includes an unsubscribe link at the bottom. You can also contact us and we'll remove you within 24 hours.",
  },
  {
    q: "Is your content suitable for all hair types?",
    a: "Absolutely. We intentionally cover straight, wavy, curly, and coily hair, as well as diverse concerns like thinning, damage, and scalp health.",
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero
        badge="FAQ"
        title="Frequently asked questions"
        subtitle="Quick answers to common questions about The Hair Edit."
      />
      <section className="max-w-3xl mx-auto px-5 sm:px-6 py-16">
        <div className="bg-white rounded-[28px] p-8 md:p-10 border border-black/5 shadow-sm">
          {FAQS.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>
    </>
  );
}
