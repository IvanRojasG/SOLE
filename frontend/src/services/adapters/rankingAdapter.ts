import type { RankingEntry } from '@/types';

export function adaptRankingEntries(entries: RankingEntry[]): RankingEntry[] {
  return [...entries]
    .sort(
      (left, right) =>
        (left.points === 0 ? 1 : 0) - (right.points === 0 ? 1 : 0) ||
        left.points - right.points ||
        left.athleteName.localeCompare(right.athleteName),
    )
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
}
