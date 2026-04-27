import { dataSource } from '@/lib/config/dataSource';
import { backendRequest } from '@/services/api/backend';
import { getSession, type AuthSession } from '@/services/auth/session';
import { mockAchievements } from '@/services/mocks/achievements';
import { mockAthletes } from '@/services/mocks/athletes';
import { mockAttendance } from '@/services/mocks/attendance';
import { mockChallenges } from '@/services/mocks/challenges';
import { mockCoachDashboard } from '@/services/mocks/coachDashboard';
import { getChallenges } from '@/services/repository/challengeRepository';
import { getRanking } from '@/services/repository/rankingRepository';
import type {
  Athlete,
  Attendance,
  AttendanceSessionRecord,
  ChallengeManagementItem,
  CoachDashboard,
  PendingAchievementReview,
} from '@/types';

async function getCoachDashboardFromApi(session?: AuthSession): Promise<CoachDashboard> {
  const authSession = session ?? await getSession();
  const [dashboard, pending, sessions, ranking] = await Promise.all([
    backendRequest<{
      total_athletes: number;
      pending_achievements: number;
      approved_achievements: number;
    }>('/dashboard', { role: 'coach', session: authSession ?? undefined }),
    getPendingAchievementReviewsFromApi(authSession ?? undefined),
    getCoachSessionsFromApi(authSession ?? undefined),
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
      { id: 'coach-api-1', label: 'Atletas activos', value: String(dashboard.total_athletes), tone: 'primary' },
      { id: 'coach-api-2', label: 'Pendientes', value: String(dashboard.pending_achievements), tone: 'secondary' },
      { id: 'coach-api-3', label: 'Aprobados', value: String(dashboard.approved_achievements), tone: 'neutral' },
      { id: 'coach-api-4', label: 'Sesiones', value: String(sessions.length), tone: 'primary' },
    ],
    pendingApprovals: pending.slice(0, 3),
    todayAttendance: sessions.slice(0, 2),
    topAthletes: ranking.slice(0, 3),
  };
}

async function getCoachAthletesFromApi(session?: AuthSession): Promise<Athlete[]> {
  const payload = await backendRequest<
    Array<{ id: string; full_name: string; level: string; baseline_locked: boolean }>
  >('/athletes', { role: 'coach', session });
  const publicAthletes = await getAthletesFromPublicApi();

  return payload.map((athlete, index) => {
    const publicMatch = publicAthletes.find((item) => item.id === athlete.id);
    return {
      id: athlete.id,
      fullName: athlete.full_name,
      level: athlete.level as Athlete['level'],
      city: 'SOLE Box',
      favoriteFocus: 'General fitness',
      points: publicMatch?.points ?? 0,
      attendanceRate: 0,
      achievementsApproved: 0,
      streakDays: 0,
      avatarColor: ['#f75c03', '#1fb6aa', '#f2c230', '#ff6b6b'][index % 4],
      tagline: athlete.baseline_locked ? 'Baseline bloqueado.' : 'Baseline pendiente de cierre.',
    };
  });
}

async function getCoachAttendanceFromApi(session?: AuthSession): Promise<Attendance[]> {
  const athletes = await getCoachAthletesFromApi(session);
  return athletes.map((athlete, index) => ({
    id: `api-att-${athlete.id}`,
    athleteId: athlete.id,
    sessionDate: `2026-04-${String((index % 9) + 1).padStart(2, '0')}`,
    checkedIn: true,
  }));
}

async function getCoachSessionsFromApi(session?: AuthSession): Promise<AttendanceSessionRecord[]> {
  const payload = await backendRequest<
    Array<{ id: string; session_date: string; checked_in_count: number }>
  >('/attendance/sessions', { role: 'coach', session });

  return payload.map((item, index) => ({
    id: item.id,
    sessionDate: item.session_date,
    title: `Session ${index + 1}`,
    checkedInCount: item.checked_in_count,
    totalExpected: item.checked_in_count + 4,
  }));
}

async function getPendingAchievementReviewsFromApi(session?: AuthSession): Promise<PendingAchievementReview[]> {
  const payload = await backendRequest<
    Array<{
      id: string;
      athlete_id: string;
      athlete_name: string;
      challenge_id: string;
      challenge_title: string;
      achievement_date: string;
      status: PendingAchievementReview['status'];
      points_awarded: number;
    }>
  >('/achievements/pending/detailed', { role: 'coach', session });

  return payload.map((item) => ({
    id: item.id,
    athleteId: item.athlete_id,
    athleteName: item.athlete_name,
    challengeId: item.challenge_id,
    title: item.challenge_title,
    status: item.status,
    achievementDate: item.achievement_date,
    pointsAwarded: item.points_awarded,
    notes: 'Sincronizado desde backend para revisión del coach.',
  }));
}

async function getChallengeManagementItemsFromApi(session?: AuthSession): Promise<ChallengeManagementItem[]> {
  const payload = await backendRequest<
    Array<{
      id: string;
      title: string;
      category: ChallengeManagementItem['category'];
      difficulty: ChallengeManagementItem['difficulty'];
      summary: string;
      window_label: string;
      is_active: boolean;
      points: number;
    }>
  >('/challenges', { role: 'coach', session });

  return payload.map((challenge) => ({
    id: challenge.id,
    title: challenge.title,
    category: challenge.category,
    difficulty: challenge.difficulty,
    summary: challenge.summary,
    windowLabel: challenge.window_label,
    isActive: challenge.is_active,
    points: challenge.points,
  }));
}

export async function getCoachDashboard(session?: AuthSession): Promise<CoachDashboard> {
  if (dataSource === 'api') {
    return getCoachDashboardFromApi(session);
  }

  return structuredClone(mockCoachDashboard);
}

export async function getCoachAthletes(session?: AuthSession): Promise<Athlete[]> {
  if (dataSource === 'api') {
    return getCoachAthletesFromApi(session);
  }

  return [...mockAthletes].sort((left, right) => right.points - left.points);
}

export async function getCoachAttendanceRecords(session?: AuthSession): Promise<Attendance[]> {
  if (dataSource === 'api') {
    return getCoachAttendanceFromApi(session);
  }

  return [...mockAttendance].sort((left, right) => right.sessionDate.localeCompare(left.sessionDate));
}

export async function getCoachAttendanceSessions(session?: AuthSession): Promise<AttendanceSessionRecord[]> {
  if (dataSource === 'api') {
    return getCoachSessionsFromApi(session);
  }

  return structuredClone(mockCoachDashboard.todayAttendance);
}

export async function getPendingAchievementReviews(session?: AuthSession): Promise<PendingAchievementReview[]> {
  if (dataSource === 'api') {
    return getPendingAchievementReviewsFromApi(session);
  }

  return mockAchievements
    .filter((item) => item.status === 'submitted')
    .map((achievement) => ({
      ...achievement,
      athleteName:
        mockAthletes.find((athlete) => athlete.id === achievement.athleteId)?.fullName ?? 'Unknown athlete',
      notes: 'Pendiente de revisión visual por parte del coach.',
    }));
}

export async function getChallengeManagementItems(session?: AuthSession): Promise<ChallengeManagementItem[]> {
  if (dataSource === 'api') {
    return getChallengeManagementItemsFromApi(session);
  }

  return mockChallenges.map((challenge, index) => ({
    ...challenge,
    isActive: index !== mockChallenges.length - 1,
  }));
}

async function getAthletesFromPublicApi() {
  return backendRequest<Array<{ id: string; points: number }>>('/public/athletes');
}
