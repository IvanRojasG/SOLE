import type { Athlete } from '@/types';

import { AthleteCard } from './AthleteCard';

type AthleteGridProps = {
  athletes: Athlete[];
};

export function AthleteGrid({ athletes }: AthleteGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
      {athletes.map((athlete) => (
        <AthleteCard key={athlete.id} athlete={athlete} />
      ))}
    </div>
  );
}
