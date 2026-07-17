import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/public/PageHero";
import { IMAGES } from "@/lib/images";
import { SITE } from "@/lib/navigation";

export const metadata = {
  title: `About — ${SITE.name}`,
  description: "Learn about our mission to deliver inspiring and genuinely useful beauty advice.",
};

export default function AboutPage() {
  const team = [
    {
      name: "Ashley Morgan",
      role: "Editor in Chief",
      bio: "Former beauty editor with 12 years covering hair trends at top lifestyle publications.",
      image: IMAGES.authorAvatar,
    },
    {
      name: "Gabrielle Hurwitz",
      role: "Senior Writer",
      bio: "Specializes in hair color science and at-home care routines.",
      image: IMAGES.lookBob,
    },
    {
      name: "Dr. Sarah Chen",
      role: "Expert Reviewer",
      bio: "Board-certified dermatologist focused on scalp and hair health.",
      image: IMAGES.expertAvatar,
    },
  ];

  const values = [
    {
      title: "Expert-backed",
      text: "Every guide is reviewed by stylists, colorists, or dermatologists before publishing.",
    },
    {
      title: "Inclusive",
      text: "We cover all hair types, textures, and concerns — because great hair advice is for everyone.",
    },
    {
      title: "Honest",
      text: "We test products, explain trade-offs, and never recommend what we wouldn't use ourselves.",
    },
  ];

  return (
    <>
      <PageHero
        badge="About us"
        title="Beauty advice should feel inspiring—and genuinely useful."
        subtitle="We're a team of editors, stylists, and experts dedicated to helping you find your next look."
      />

      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-[28px] overflow-hidden">
            <Image
              src={IMAGES.lifestyle}
              alt="The Hair Edit team"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold mb-6">Our story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {SITE.name} started with a simple idea: hair content online is either too basic
              or too salesy. We wanted something in between — editorial-quality stories that
              actually help you make decisions at the salon and at home.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today we publish guides on everything from soft layered cuts to scalp care
              routines, always with the goal of making you feel confident about your hair.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">What we believe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-cream rounded-[24px] p-8 border border-black/5"
              >
                <h3 className="font-serif text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 py-16 md:py-20">
        <h2 className="font-serif text-3xl font-bold text-center mb-12">Meet the team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden mb-5 ring-2 ring-rose/50">
                <Image src={member.image} alt={member.name} fill className="object-cover" />
              </div>
              <h3 className="font-serif text-lg font-bold">{member.name}</h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-terracotta mt-1">
                {member.role}
              </p>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-plum py-16 text-center">
        <div className="max-w-2xl mx-auto px-5">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            Want to work with us?
          </h2>
          <p className="text-white/70 text-sm mb-8">
            We&apos;re always open to editorial pitches, partnerships, and press inquiries.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3.5 bg-white text-plum rounded-full font-semibold text-sm hover:bg-rose transition-colors"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
