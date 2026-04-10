import type { RankingEntry } from '@/types';

export function adaptRankingEntries(entries: RankingEntry[]): RankingEntry[] {
  return [...entries]
    .sort((left, right) => right.points - left.points || left.athleteName.localeCompare(right.athleteName))
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
}
