import type { Challenge } from '@/types';

import { ChallengeCard } from './ChallengeCard';

type ChallengeGridProps = {
  challenges: Challenge[];
};

export function ChallengeGrid({ challenges }: ChallengeGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
      {challenges.map((challenge) => (
        <ChallengeCard key={challenge.id} challenge={challenge} />
      ))}
    </div>
  );
}
