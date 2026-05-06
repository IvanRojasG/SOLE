import { dataSource } from '@/lib/config/dataSource';
import { backendRequest } from '@/services/api/backend';
import { getSession, type AuthSession } from '@/services/auth/session';
import { mockAchievements } from '@/services/mocks/achievements';
import { mockAthletes } from '@/services/mocks/athletes';
import { mockChallenges } from '@/services/mocks/challenges';
import { mockCoachDashboard } from '@/services/mocks/coachDashboard';
import { getRanking } from '@/services/repository/rankingRepository';
import type {
  Athlete,
  ChallengeManagementItem,
  CoachDashboard,
  PendingAchievementReview,
} from '@/types';

async function getCoachDashboardFromApi(
  session?: AuthSession,
): Promise<CoachDashboard> {
  const authSession = session ?? (await getSession());
  const [dashboard, pending, ranking] = await Promise.all([
    backendRequest<{
      total_athletes: number;
      pending_achievements: number;
      approved_achievements: number;
    }>('/dashboard', { role: 'coach', session: authSession ?? undefined }),
    getPendingAchievementReviewsFromApi(authSession ?? undefined),
    getRanking(),
  ]);

  return {
    coach: {
      id: authSession?.user.id ?? 'coach-api',
      fullName: 'Coach SOLE',
      email: authSession?.user.email ?? 'coach@example.com',
      boxName: 'SOLE Fitness',
    },
    kpis: [
      {
        id: 'coach-api-1',
        label: 'Atletas activos',
        value: String(dashboard.total_athletes),
        tone: 'primary',
      },
      {
        id: 'coach-api-2',
        label: 'Pendientes',
        value: String(dashboard.pending_achievements),
        tone: 'secondary',
      },
      {
        id: 'coach-api-3',
        label: 'Aprobados',
        value: String(dashboard.approved_achievements),
        tone: 'neutral',
      },
      {
        id: 'coach-api-4',
        label: 'Top ranking',
        value: String(ranking.length),
        tone: 'primary',
      },
    ],
    pendingApprovals: pending.slice(0, 3),
    topAthletes: ranking.slice(0, 3),
  };
}

async function getCoachAthletesFromApi(
  session?: AuthSession,
): Promise<Athlete[]> {
  const payload = await backendRequest<
    Array<{
      id: string;
      full_name: string;
      level: string;
      baseline_locked: boolean;
      points: number;
      approved_achievements: number;
    }>
  >('/athletes', { role: 'coach', session });

  return payload
    .map((athlete, index) => ({
      id: athlete.id,
      fullName: athlete.full_name,
      level: athlete.level as Athlete['level'],
      city: '',
      favoriteFocus: 'General fitness',
      points: athlete.points,
      achievementsApproved: athlete.approved_achievements,
      avatarColor: ['#f75c03', '#1fb6aa', '#f2c230', '#ff6b6b'][index % 4],
      tagline: athlete.baseline_locked
        ? 'Baseline bloqueado.'
        : 'Baseline pendiente de cierre.',
    }))
    .sort(
      (left, right) =>
        (left.points === 0 ? 1 : 0) - (right.points === 0 ? 1 : 0) ||
        left.points - right.points ||
        left.fullName.localeCompare(right.fullName),
    );
}

async function getPendingAchievementReviewsFromApi(
  session?: AuthSession,
): Promise<PendingAchievementReview[]> {
  type CoachAchievementPayload = Array<{
    id: string;
    athlete_id: string;
    athlete_name: string;
    challenge_id: string;
    challenge_title: string;
    achievement_date: string;
    status: PendingAchievementReview['status'];
    points_awarded: number;
    completed?: boolean;
    result_format?: PendingAchievementReview['resultFormat'];
    time_seconds?: number | null;
    reps_completed?: number | null;
    weight_lbs?: number | null;
    tie_break_order?: number | null;
    rank_points?: number | null;
  }>;

  let payload: CoachAchievementPayload;

  payload = await backendRequest<CoachAchievementPayload>(
    '/achievements/detailed',
    {
      role: 'coach',
      session,
    },
  );

  return payload.map((item) => ({
    id: item.id,
    athleteId: item.athlete_id,
    athleteName: item.athlete_name,
    challengeId: item.challenge_id,
    title: item.challenge_title,
    status: item.status,
    achievementDate: item.achievement_date,
    pointsAwarded: item.points_awarded,
    completed: item.completed ?? true,
    resultFormat: item.result_format ?? 'scaled',
    timeSeconds: item.time_seconds ?? 1,
    repsCompleted: item.reps_completed ?? null,
    weightLbs: item.weight_lbs ?? null,
    tieBreakOrder: item.tie_break_order ?? null,
    rankPoints: item.rank_points ?? null,
    notes: 'Sincronizado desde backend para revisión del coach.',
  }));
}

async function getChallengeManagementItemsFromApi(
  session?: AuthSession,
): Promise<ChallengeManagementItem[]> {
  const payload = await backendRequest<
    Array<{
      id: string;
      title: string;
      category: ChallengeManagementItem['category'];
      summary: string;
      start_date: string;
      end_date: string;
      youtube_url: string;
      total_reps: number;
      is_active: boolean;
    }>
  >('/challenges', { role: 'coach', session });

  return payload.map((challenge) => ({
    id: challenge.id,
    title: challenge.title,
    category: challenge.category,
    summary: challenge.summary,
    startDate: challenge.start_date,
    endDate: challenge.end_date,
    youtubeUrl: challenge.youtube_url,
    totalReps: challenge.total_reps,
    isActive: challenge.is_active,
  }));
}

export async function getCoachDashboard(
  session?: AuthSession,
): Promise<CoachDashboard> {
  if (dataSource === 'api') {
    return getCoachDashboardFromApi(session);
  }

  return structuredClone(mockCoachDashboard);
}

export async function getCoachAthletes(
  session?: AuthSession,
): Promise<Athlete[]> {
  if (dataSource === 'api') {
    return getCoachAthletesFromApi(session);
  }

  return [...mockAthletes].sort(
    (left, right) =>
      (left.points === 0 ? 1 : 0) - (right.points === 0 ? 1 : 0) ||
      left.points - right.points,
  );
}

export async function getPendingAchievementReviews(
  session?: AuthSession,
): Promise<PendingAchievementReview[]> {
  if (dataSource === 'api') {
    return getPendingAchievementReviewsFromApi(session);
  }

  return mockAchievements
    .filter((item) => item.status === 'submitted' || item.status === 'approved')
    .map((achievement) => ({
      ...achievement,
      athleteName:
        mockAthletes.find((athlete) => athlete.id === achievement.athleteId)
          ?.fullName ?? 'Unknown athlete',
      notes:
        achievement.status === 'approved'
          ? 'Resultado aprobado disponible para corrección del coach.'
          : 'Pendiente de revisión visual por parte del coach.',
    }));
}

export async function getChallengeManagementItems(
  session?: AuthSession,
): Promise<ChallengeManagementItem[]> {
  if (dataSource === 'api') {
    return getChallengeManagementItemsFromApi(session);
  }

  return mockChallenges.map((challenge, index) => ({
    ...challenge,
    isActive: index !== mockChallenges.length - 1,
  }));
}
