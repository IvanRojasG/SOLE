import { PublicLandingPage } from '@/components/public/PublicLandingPage';
import { getChallenges } from '@/services/repository/challengeRepository';

export default async function HomePage() {
  const today = new Date().toISOString().slice(0, 10);
  const challenges = await getChallenges();
  const activeChallenge =
    challenges.find(
      (challenge) =>
        challenge.isActive &&
        challenge.startDate <= today &&
        challenge.endDate >= today,
    ) ?? null;

  return <PublicLandingPage activeChallenge={activeChallenge} />;
}
