import { dataSource } from '@/lib/config/dataSource';
import { backendRequest } from '@/services/api/backend';
import { adaptRankingEntries } from '@/services/adapters/rankingAdapter';
import { mockRanking } from '@/services/mocks/ranking';
import type { RankingEntry } from '@/types';

async function getRankingFromApi(): Promise<RankingEntry[]> {
  const [payload, publicAthletes] = await Promise.all([
    backendRequest<Array<{ athlete_id: string; athlete_name: string; points: number; result_format: RankingEntry['resultFormat'] }>>('/ranking'),
    backendRequest<Array<{ id: string; level: string }>>('/public/athletes'),
  ]);

  return adaptRankingEntries(
    payload.map((entry) => ({
      athleteId: entry.athlete_id,
      athleteName: entry.athlete_name,
      level:
        (publicAthletes.find((athlete) => athlete.id === entry.athlete_id)?.level as RankingEntry['level']) ??
        'scaled',
      rank: 0,
      points: entry.points,
      resultFormat: entry.result_format,
      delta: 0,
      approvedAchievements: 0,
    })),
  );
}

export async function getRanking(): Promise<RankingEntry[]> {
  if (dataSource === 'api') {
    return getRankingFromApi();
  }

  return adaptRankingEntries(mockRanking);
}
