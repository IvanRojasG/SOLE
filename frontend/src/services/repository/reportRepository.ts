import { backendRequest } from '@/services/api/backend';
import type { ClassifierWodReport } from '@/types';

type ClassifierWodReportPayload = {
  generated_at: string;
  total_rows: number;
  rows: Array<{
    athlete_id: string;
    athlete_name: string;
    athlete_level: ClassifierWodReport['rows'][number]['athleteLevel'];
    challenge_id: string;
    challenge_title: string;
    challenge_end_date: string;
    result_format: ClassifierWodReport['rows'][number]['resultFormat'];
    score_label: string;
    completed: boolean;
    time_seconds: number | null;
    reps_completed: number | null;
    weight_lbs: number | string | null;
    tie_break_order: number | null;
    rank_points: number;
    achievement_date: string;
  }>;
};

export async function getClassifierWodReport(): Promise<ClassifierWodReport> {
  const payload = await backendRequest<ClassifierWodReportPayload>(
    '/reports/classifier-wods',
    {
      role: 'coach',
      nextTarget: '/coach/reports/classifier-wods',
    },
  );

  return {
    generatedAt: payload.generated_at,
    totalRows: payload.total_rows,
    rows: payload.rows.map((row) => ({
      athleteId: row.athlete_id,
      athleteName: row.athlete_name,
      athleteLevel: row.athlete_level,
      challengeId: row.challenge_id,
      challengeTitle: row.challenge_title,
      challengeEndDate: row.challenge_end_date,
      resultFormat: row.result_format,
      scoreLabel: row.score_label,
      completed: row.completed,
      timeSeconds: row.time_seconds,
      repsCompleted: row.reps_completed,
      weightLbs: row.weight_lbs,
      tieBreakOrder: row.tie_break_order,
      rankPoints: row.rank_points,
      achievementDate: row.achievement_date,
    })),
  };
}
