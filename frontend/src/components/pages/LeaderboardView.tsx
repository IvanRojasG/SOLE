'use client';

import { useDeferredValue, useMemo, useState } from 'react';

import { AppContainer } from '@/components/layout/AppContainer';
import { Section } from '@/components/layout/Section';
import { LeaderboardFilters } from '@/components/leaderboard/LeaderboardFilters';
import { LeaderboardMobileCards } from '@/components/leaderboard/LeaderboardMobileCards';
import { TopThreePodium } from '@/components/leaderboard/TopThreePodium';
import type { AthleteLevel, RankingEntry } from '@/types';

type LeaderboardViewProps = {
  entries: RankingEntry[];
};

export function LeaderboardView({ entries }: LeaderboardViewProps) {
  const [query, setQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<AthleteLevel | 'all'>('all');
  const deferredQuery = useDeferredValue(query);

  const levels = useMemo(
    () => Array.from(new Set(entries.map((entry) => entry.level))),
    [entries],
  );

  const filteredEntries = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchesLevel = selectedLevel === 'all' || entry.level === selectedLevel;
      const matchesQuery = normalizedQuery.length === 0 || entry.athleteName.toLowerCase().includes(normalizedQuery);
      return matchesLevel && matchesQuery;
    });
  }, [deferredQuery, entries, selectedLevel]);

  return (
    <Section className="pt-0">
      <AppContainer className="space-y-6 lg:space-y-8">
        <LeaderboardFilters
          levels={levels}
          selectedLevel={selectedLevel}
          onLevelChange={setSelectedLevel}
          query={query}
          onQueryChange={setQuery}
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
              Podio actual
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Top atletas del mes</h2>
          </div>
          <div className="rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            {filteredEntries.length} atletas visibles
          </div>
        </div>
        <TopThreePodium entries={filteredEntries.slice(0, 3)} />
        <LeaderboardMobileCards entries={filteredEntries} />
      </AppContainer>
    </Section>
  );
}
