import type { RankingEntry } from '@/types';

export function adaptRankingEntries(entries: RankingEntry[]): RankingEntry[] {
  return entries.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}
