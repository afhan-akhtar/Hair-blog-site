import { PageHero } from "@/components/public/PageHero";
import { ContactForm } from "@/components/public/ContactForm";
import { SITE } from "@/lib/navigation";
import { Mail, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: `Contact — ${SITE.name}`,
  description: "Get in touch with The Hair Edit team for editorial, partnership, or general inquiries.",
};

const CONTACT_INFO = [
  {
    icon: Mail,
    title: "Email",
    detail: "hello@thehairedit.com",
    sub: "We reply within 1–2 business days",
  },
  {
    icon: MapPin,
    title: "Office",
    detail: "New York, NY",
    sub: "Remote-first editorial team",
  },
  {
    icon: Clock,
    title: "Hours",
    detail: "Mon – Fri, 9am – 6pm ET",
    sub: "Closed weekends & holidays",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        badge="Contact"
        title="We'd love to hear from you"
        subtitle="Whether it's a story idea, partnership, or just a question — drop us a line."
      />

      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Info sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {CONTACT_INFO.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex gap-4 p-6 bg-white rounded-[20px] border border-black/5"
                >
                  <div className="w-10 h-10 rounded-full bg-rose/40 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-plum" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                      {item.title}
                    </p>
                    <p className="font-medium text-charcoal">{item.detail}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.sub}</p>
                  </div>
                </div>
              );
            })}

            <div className="p-6 bg-cream rounded-[20px] border border-black/5">
              <p className="text-sm font-semibold text-charcoal mb-2">Editorial pitches</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Have a hair story to share? Include your angle, credentials, and 2–3 sample links
                in your message.
              </p>
            </div>
          </div>

          {/* Web3Forms */}
          <div className="lg:col-span-3 bg-white rounded-[28px] p-8 md:p-10 border border-black/5 shadow-sm">
            <h2 className="font-serif text-2xl font-bold mb-6">Send a message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
