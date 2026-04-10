'use client';

import { useDeferredValue, useMemo, useState } from 'react';

import { AthleteGrid } from '@/components/athletes/AthleteGrid';
import { AthleteSearch } from '@/components/athletes/AthleteSearch';
import { AppContainer } from '@/components/layout/AppContainer';
import { Section } from '@/components/layout/Section';
import type { Athlete } from '@/types';

type AthletesViewProps = {
  athletes: Athlete[];
};

export function AthletesView({ athletes }: AthletesViewProps) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const filteredAthletes = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    if (normalizedQuery.length === 0) {
      return athletes;
    }

    return athletes.filter((athlete) =>
      [athlete.fullName, athlete.city, athlete.favoriteFocus, athlete.level]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [athletes, deferredQuery]);

  return (
    <Section className="pt-0">
      <AppContainer className="space-y-6 lg:space-y-8">
        <AthleteSearch value={query} onChange={setQuery} />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
              Directorio
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Atletas visibles del reto</h2>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
            {filteredAthletes.length} atletas
          </div>
        </div>
        <AthleteGrid athletes={filteredAthletes} />
      </AppContainer>
    </Section>
  );
}
