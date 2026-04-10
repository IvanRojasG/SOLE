'use client';

import { useDeferredValue, useMemo, useState } from 'react';

import { AthleteManagementTable } from '@/components/coach/AthleteManagementTable';
import { AthleteQuickViewDrawer } from '@/components/coach/AthleteQuickViewDrawer';
import type { Athlete } from '@/types';

type CoachAthletesViewProps = {
  athletes: Athlete[];
};

export function CoachAthletesView({ athletes }: CoachAthletesViewProps) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);

  const filteredAthletes = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return athletes;
    }

    return athletes.filter((athlete) =>
      [athlete.fullName, athlete.city, athlete.level, athlete.favoriteFocus]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [athletes, deferredQuery]);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar atleta por nombre, ciudad o nivel"
          className="w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
        />
      </div>
      <AthleteManagementTable athletes={filteredAthletes} onSelect={setSelectedAthlete} />
      <AthleteQuickViewDrawer
        athlete={selectedAthlete}
        open={selectedAthlete !== null}
        onClose={() => setSelectedAthlete(null)}
      />
    </div>
  );
}
