import { dataSource } from '@/lib/config/dataSource';
import { backendRequest } from '@/services/api/backend';
import { adaptRankingEntries } from '@/services/adapters/rankingAdapter';
import { mockRanking } from '@/services/mocks/ranking';
import type { RankingEntry } from '@/types';

type RankingQuery = {
  view?: 'event' | 'challenge';
  challengeId?: string;
};

function buildRankingPath(query: RankingQuery): string {
  const params = new URLSearchParams();
  if (query.view) {
    params.set('view', query.view);
  }
  if (query.challengeId) {
    params.set('challenge_id', query.challengeId);
  }
  const queryString = params.toString();
  return queryString ? `/ranking?${queryString}` : '/ranking';
}

async function getRankingFromApi(query: RankingQuery): Promise<RankingEntry[]> {
  const [payload, publicAthletes] = await Promise.all([
    backendRequest<
      Array<{
        athlete_id: string;
        athlete_name: string;
        points: number;
        result_format: RankingEntry['resultFormat'];
        approved_achievements: number;
        challenge_id: string | null;
        challenge_title: string | null;
        challenge_end_date: string | null;
        completed: boolean;
        time_seconds: number | null;
        reps_completed: number | null;
        is_finalized: boolean;
        ranking_view: 'event' | 'challenge';
        wods_scored: number;
      }>
    >(buildRankingPath(query)),
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
      approvedAchievements: entry.approved_achievements,
      challengeId: entry.challenge_id,
      challengeTitle: entry.challenge_title,
      challengeEndDate: entry.challenge_end_date,
      completed: entry.completed,
      timeSeconds: entry.time_seconds,
      repsCompleted: entry.reps_completed,
      isFinalized: entry.is_finalized,
      rankingView: entry.ranking_view,
      wodsScored: entry.wods_scored,
    })),
  );
}

export async function getRanking(query: RankingQuery = {}): Promise<RankingEntry[]> {
  if (dataSource === 'api') {
    return getRankingFromApi(query);
  }

  return adaptRankingEntries(
    mockRanking.map((entry) => ({
      ...entry,
      rankingView: query.view ?? entry.rankingView,
      challengeId: query.challengeId ?? entry.challengeId,
    })),
  );
}
