import { HeroSection } from "@/components/public/HeroSection";
import { NewsletterBanner } from "@/components/public/NewsletterBanner";
import {
  LooksSection,
  LatestStoriesSection,
  CtaBanner,
  ConcernsSection,
  QuizWidget,
  QuoteSection,
} from "@/components/public/HomeSections";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LooksSection />
      <LatestStoriesSection />
      <CtaBanner />
      <ConcernsSection />
      <QuizWidget />
      <QuoteSection />
      <NewsletterBanner />
    </>
  );
}
