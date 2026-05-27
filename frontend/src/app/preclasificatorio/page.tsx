import type { Metadata } from 'next';

import { PrequalifierView } from '@/components/pages/PrequalifierView';
import { brand } from '@/lib/config/brand';
import { getChallenges } from '@/services/repository/challengeRepository';
import { getRanking } from '@/services/repository/rankingRepository';

export const metadata: Metadata = {
  title: `${brand.name} | Preclasificatorio`,
  description: 'Top 10 preclasificatorio del reto Burn the Ships de SOLE Fitness.',
};

export default async function PreclasificatorioPage() {
  const [entries, challenges] = await Promise.all([
    getRanking({ view: 'event' }),
    getChallenges(),
  ]);
  const challengeRankings = Object.fromEntries(
    await Promise.all(
      challenges.map(async (challenge) => [
        challenge.id,
        await getRanking({ view: 'challenge', challengeId: challenge.id }),
      ]),
    ),
  );

  return (
    <PrequalifierView
      entries={entries}
      challenges={challenges}
      challengeRankings={challengeRankings}
    />
  );
}
