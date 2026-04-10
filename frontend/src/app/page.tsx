import { CTASection } from '@/components/home/CTASection';
import { ChallengePreviewSection } from '@/components/home/ChallengePreviewSection';
import { EventHighlightStrip } from '@/components/home/EventHighlightStrip';
import { FeaturedStatsSection } from '@/components/home/FeaturedStatsSection';
import { HeroBanner } from '@/components/home/HeroBanner';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { TopAthletesPreview } from '@/components/home/TopAthletesPreview';

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <EventHighlightStrip />
      <FeaturedStatsSection />
      <TopAthletesPreview />
      <ChallengePreviewSection />
      <HowItWorksSection />
      <CTASection />
    </>
  );
}
