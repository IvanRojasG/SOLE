'use client';

import { useDeferredValue, useMemo, useState } from 'react';

import { AppContainer } from '@/components/layout/AppContainer';
import { Section } from '@/components/layout/Section';
import { LeaderboardFilters } from '@/components/leaderboard/LeaderboardFilters';
import { LeaderboardMobileCards } from '@/components/leaderboard/LeaderboardMobileCards';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { TopThreePodium } from '@/components/leaderboard/TopThreePodium';
import type { AthleteLevel, Challenge, RankingEntry, ResultFormat } from '@/types';

type LeaderboardViewProps = {
  entries: RankingEntry[];
  challenges: Challenge[];
  challengeRankings: Record<string, RankingEntry[]>;
};

export function LeaderboardView({
  entries,
  challenges,
  challengeRankings,
}: LeaderboardViewProps) {
  const defaultChallengeId =
    challenges.find((challenge) => challenge.isActive)?.id ?? challenges[0]?.id ?? '';
  const [rankingMode, setRankingMode] = useState<'event' | 'challenge'>(
    'event',
  );
  const [selectedChallengeId, setSelectedChallengeId] =
    useState(defaultChallengeId);
  const [query, setQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<AthleteLevel | 'all'>(
    'all',
  );
  const [selectedFormat, setSelectedFormat] = useState<ResultFormat | 'all'>(
    'all',
  );
  const deferredQuery = useDeferredValue(query);
  const isEventMode = rankingMode === 'event';
  const selectedChallenge = challenges.find(
    (challenge) => challenge.id === selectedChallengeId,
  );
  const currentEntries = useMemo(
    () =>
      isEventMode
        ? entries
        : challengeRankings[selectedChallengeId] ?? [],
    [challengeRankings, entries, isEventMode, selectedChallengeId],
  );

  const levels = useMemo(
    () => Array.from(new Set(currentEntries.map((entry) => entry.level))),
    [currentEntries],
  );

  const filteredEntries = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return currentEntries
      .filter((entry) => {
        const matchesLevel =
          selectedLevel === 'all' || entry.level === selectedLevel;
        const matchesFormat =
          isEventMode ||
          selectedFormat === 'all' ||
          entry.resultFormat === selectedFormat;
        const matchesQuery =
          normalizedQuery.length === 0 ||
          entry.athleteName.toLowerCase().includes(normalizedQuery);
        return matchesLevel && matchesFormat && matchesQuery;
      })
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));
  }, [currentEntries, deferredQuery, isEventMode, selectedFormat, selectedLevel]);

  const podiumEntries = useMemo(
    () => filteredEntries.slice(0, 3),
    [filteredEntries],
  );
  const currentTitle = isEventMode
    ? 'Total evento'
    : selectedChallenge?.title ?? 'WOD individual';
  const isFinalized = isEventMode || currentEntries.some((entry) => entry.isFinalized);
  const podiumKey = `${rankingMode}-${selectedChallengeId}-${selectedLevel}-${selectedFormat}-${deferredQuery}-${podiumEntries.map((entry) => `${entry.athleteId}-${entry.resultFormat}-${entry.points}-${entry.timeSeconds}-${entry.repsCompleted}`).join('-')}`;

  return (
    <Section className="pt-0">
      <AppContainer className="space-y-6 lg:space-y-8">
        <div className="flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-white/90 p-4 shadow-[0_18px_48px_rgba(15,23,42,0.07)] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {(['event', 'challenge'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setRankingMode(mode)}
                className={`rounded-full px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase transition ${
                  rankingMode === mode
                    ? 'bg-slate-950 text-white shadow-[0_14px_34px_rgba(15,23,42,0.2)]'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-950'
                }`}
              >
                {mode === 'event' ? 'Total evento' : 'WOD individual'}
              </button>
            ))}
          </div>
          {rankingMode === 'challenge' ? (
            <label className="grid gap-2 lg:min-w-80">
              <span className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Seleccionar WOD
              </span>
              <select
                value={selectedChallengeId}
                onChange={(event) => setSelectedChallengeId(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-[color:var(--color-primary)]"
              >
                {challenges.map((challenge) => (
                  <option key={challenge.id} value={challenge.id}>
                    {challenge.title}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
        <LeaderboardFilters
          levels={levels}
          selectedLevel={selectedLevel}
          onLevelChange={setSelectedLevel}
          selectedFormat={selectedFormat}
          onFormatChange={setSelectedFormat}
          query={query}
          onQueryChange={setQuery}
          showFormatFilter={!isEventMode}
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[color:var(--color-primary)] uppercase">
              {isEventMode ? 'Leaderboard del evento' : 'Ranking por WOD'}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              {currentTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              {isEventMode
                ? 'Menor puntaje acumulado lidera. Se suman todos los WODs finalizados del evento.'
                : 'Completados primero por menor tiempo; luego parciales por mayor cantidad de reps.'}
              {!isEventMode && (isFinalized ? ' Los puntos ya fueron finalizados.' : ' Los puntos quedan en 0 hasta el cierre del WOD.')}
            </p>
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
