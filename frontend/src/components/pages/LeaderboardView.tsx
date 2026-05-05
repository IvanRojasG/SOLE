'use client';

import { useDeferredValue, useMemo, useState } from 'react';

import { AppContainer } from '@/components/layout/AppContainer';
import { Section } from '@/components/layout/Section';
import { LeaderboardFilters } from '@/components/leaderboard/LeaderboardFilters';
import { LeaderboardMobileCards } from '@/components/leaderboard/LeaderboardMobileCards';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { TopThreePodium } from '@/components/leaderboard/TopThreePodium';
import type { AthleteLevel, RankingEntry, ResultFormat } from '@/types';

type LeaderboardViewProps = {
  entries: RankingEntry[];
};

export function LeaderboardView({ entries }: LeaderboardViewProps) {
  const [query, setQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<AthleteLevel | 'all'>(
    'all',
  );
  const [selectedFormat, setSelectedFormat] = useState<ResultFormat | 'all'>(
    'all',
  );
  const deferredQuery = useDeferredValue(query);

  const levels = useMemo(
    () => Array.from(new Set(entries.map((entry) => entry.level))),
    [entries],
  );

  const filteredEntries = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return entries
      .filter((entry) => {
        const matchesLevel =
          selectedLevel === 'all' || entry.level === selectedLevel;
        const matchesFormat =
          selectedFormat === 'all' || entry.resultFormat === selectedFormat;
        const matchesQuery =
          normalizedQuery.length === 0 ||
          entry.athleteName.toLowerCase().includes(normalizedQuery);
        return matchesLevel && matchesFormat && matchesQuery;
      })
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));
  }, [deferredQuery, entries, selectedFormat, selectedLevel]);

  const podiumEntries = useMemo(
    () => filteredEntries.slice(0, 3),
    [filteredEntries],
  );
  const podiumKey = `${selectedLevel}-${selectedFormat}-${deferredQuery}-${podiumEntries.map((entry) => `${entry.athleteId}-${entry.resultFormat}-${entry.points}`).join('-')}`;

  return (
    <Section className="pt-0">
      <AppContainer className="space-y-6 lg:space-y-8">
        <LeaderboardFilters
          levels={levels}
          selectedLevel={selectedLevel}
          onLevelChange={setSelectedLevel}
          selectedFormat={selectedFormat}
          onFormatChange={setSelectedFormat}
          query={query}
          onQueryChange={setQuery}
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[color:var(--color-primary)] uppercase">
              Podio actual
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Menor puntaje lidera
            </h2>
          </div>
          <div className="rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            {filteredEntries.length} atletas visibles
          </div>
        </div>
        <TopThreePodium key={podiumKey} entries={podiumEntries} />
        <LeaderboardTable entries={filteredEntries} />
        <LeaderboardMobileCards entries={filteredEntries} />
      </AppContainer>
    </Section>
  );
}
