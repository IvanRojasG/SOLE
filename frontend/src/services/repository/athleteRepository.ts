import { dataSource } from '@/lib/config/dataSource';
import { backendRequest } from '@/services/api/backend';
import { adaptAthletes } from '@/services/adapters/athleteAdapter';
import type { AuthSession } from '@/services/auth/session';
import { mockAchievements } from '@/services/mocks/achievements';
import { mockAthletes } from '@/services/mocks/athletes';
import { mockAttendance } from '@/services/mocks/attendance';
import { mockBaseline } from '@/services/mocks/baseline';
import type { Athlete } from '@/types';
import type { Achievement, AthleteBaseline, AthleteProfile, Attendance, BaselineEntry } from '@/types';

export const currentAthleteId = 'ath-03';

async function getAthletesFromApi(): Promise<Athlete[]> {
  const payload = await backendRequest<
    Array<{
      id: string;
      full_name: string;
      level: string;
      baseline_locked: boolean;
      points: number;
    }>
  >('/public/athletes');

  return payload.map((athlete, index) => ({
    id: athlete.id,
    fullName: athlete.full_name,
    level: (athlete.level as Athlete['level']) ?? 'scaled',
    city: 'SOLE Box',
    favoriteFocus: 'General fitness',
    points: athlete.points,
    attendanceRate: 0,
    achievementsApproved: 0,
    streakDays: 0,
    avatarColor: ['#f75c03', '#1fb6aa', '#f2c230', '#ff6b6b'][index % 4],
    tagline: athlete.baseline_locked
      ? 'Baseline completado y listo para progresar.'
      : 'Perfil público sincronizado desde backend.',
  }));
}

async function getAthleteProfileFromApi(session?: AuthSession): Promise<AthleteProfile> {
  const [user, athlete] = await Promise.all([
    backendRequest<{ email: string }>('/auth/me', { role: 'athlete', session }),
    backendRequest<{
      id: string;
      full_name: string;
      level: string;
      created_at: string;
    }>('/athletes/me', { role: 'athlete', session }),
  ]);

  return {
    athleteId: athlete.id,
    fullName: athlete.full_name,
    email: user.email,
    level: athlete.level as AthleteProfile['level'],
    city: 'SOLE Box',
    boxName: 'SOLE Fitness',
    favoriteFocus: 'General fitness',
    goals: 'Objetivos conectados a backend pendientes de campo dedicado.',
    bio: 'Perfil sincronizado desde backend. Campos extendidos siguen siendo de presentación.',
    joinedAt: athlete.created_at,
  };
}

async function getAthleteBaselineFromApi(session?: AuthSession): Promise<AthleteBaseline> {
  const payload = await backendRequest<{
    athlete_id: string;
    baseline_locked: boolean;
    prs: Array<{ id: string; movement_id: string; movement_name: string; weight: number }>;
    skills: Array<{ id: string; skill_id: string; skill_name: string; status: string }>;
    entries?: Array<{
      id: string | null;
      item_id: string;
      name: string;
      category: string;
      metric_type: string;
      unit: string;
      description: string;
      value_number: number | null;
      status: string | null;
      notes: string;
    }>;
  }>('/baseline/me/detailed', { role: 'athlete', session });

  return {
    athleteId: payload.athlete_id,
    locked: payload.baseline_locked,
    prs: payload.prs.map((item) => ({
      id: item.id,
      movementId: item.movement_id,
      movement: item.movement_name,
      unit: 'lb',
      value: Number(item.weight),
    })),
    skills: payload.skills.map((item) => ({
      id: item.id,
      skillId: item.skill_id,
      name: item.skill_name,
      status:
        item.status === 'mastered' || item.status === 'consistent' || item.status === 'developing'
          ? item.status
          : 'not_started',
    })),
    entries: (payload.entries ?? []).map((item) => ({
      id: item.id,
      itemId: item.item_id,
      name: item.name,
      category: normalizeBaselineCategory(item.category),
      metricType: normalizeBaselineMetricType(item.metric_type),
      unit: normalizeBaselineUnit(item.unit),
      description: item.description,
      value: item.value_number === null ? null : Number(item.value_number),
      status: normalizeBaselineStatus(item.status),
      notes: item.notes,
    })),
  };
}

function normalizeBaselineCategory(value: string): BaselineEntry['category'] {
  if (
    value === 'weightlifting' ||
    value === 'wod' ||
    value === 'gymnastics' ||
    value === 'skill' ||
    value === 'strength' ||
    value === 'conditioning'
  ) {
    return value;
  }

  return 'other';
}

function normalizeBaselineMetricType(value: string): BaselineEntry['metricType'] {
  if (
    value === 'weight' ||
    value === 'time' ||
    value === 'reps' ||
    value === 'distance' ||
    value === 'score' ||
    value === 'status'
  ) {
    return value;
  }

  return 'score';
}

function normalizeBaselineUnit(value: string): BaselineEntry['unit'] {
  if (
    value === 'lb' ||
    value === 'kg' ||
    value === 'seconds' ||
    value === 'reps' ||
    value === 'meters' ||
    value === 'points' ||
    value === 'status'
  ) {
    return value;
  }

  return 'points';
}

function normalizeBaselineStatus(value: string | null): BaselineEntry['status'] {
  if (value === 'developing' || value === 'consistent' || value === 'mastered') {
    return value;
  }

  return 'not_started';
}

async function getAthleteAchievementsFromApi(session?: AuthSession): Promise<Achievement[]> {
  const payload = await backendRequest<
    Array<{
      id: string;
      athlete_id: string;
      challenge_id: string;
      challenge_title: string;
      achievement_date: string;
      status: Achievement['status'];
      points_awarded: number;
    }>
  >('/achievements/me/detailed', { role: 'athlete', session });

  return payload.map((item) => ({
    id: item.id,
    athleteId: item.athlete_id,
    challengeId: item.challenge_id,
    title: item.challenge_title,
    status: item.status,
    achievementDate: item.achievement_date,
    pointsAwarded: item.points_awarded,
  }));
}

async function getAthleteAttendanceFromApi(session?: AuthSession): Promise<Attendance[]> {
  const payload = await backendRequest<
    Array<{ id: string; athlete_id: string; session_date: string }>
  >('/attendance/me/detailed', { role: 'athlete', session });

  return payload.map((item) => ({
    id: item.id,
    athleteId: item.athlete_id,
    sessionDate: item.session_date,
    checkedIn: true,
  }));
}

export async function getAthletes(): Promise<Athlete[]> {
  if (dataSource === 'api') {
    return getAthletesFromApi();
  }

  return adaptAthletes(mockAthletes);
}

export async function getCurrentAthleteProfile(session?: AuthSession): Promise<AthleteProfile> {
  if (dataSource === 'api') {
    return getAthleteProfileFromApi(session);
  }

  const athlete = mockAthletes.find((item) => item.id === currentAthleteId);

  if (!athlete) {
    throw new Error('Current athlete mock not found.');
  }

  return {
    athleteId: athlete.id,
    fullName: athlete.fullName,
    email: 'camila.rios@example.com',
    level: athlete.level,
    city: athlete.city,
    boxName: 'SOLE Box Heredia',
    favoriteFocus: athlete.favoriteFocus,
    goals: 'Consolidar toes to bar y mejorar benchmark conditioning.',
    bio: 'Atleta enfocada en técnica y constancia, con progreso visible durante el reto mensual.',
    joinedAt: '2026-02-01',
  };
}

export async function getCurrentAthleteBaseline(session?: AuthSession): Promise<AthleteBaseline> {
  if (dataSource === 'api') {
    return getAthleteBaselineFromApi(session);
  }

  return structuredClone(mockBaseline);
}

export async function getCurrentAthleteAchievements(session?: AuthSession): Promise<Achievement[]> {
  if (dataSource === 'api') {
    return getAthleteAchievementsFromApi(session);
  }

  return mockAchievements
    .filter((item) => item.athleteId === currentAthleteId)
    .sort((left, right) => right.achievementDate.localeCompare(left.achievementDate));
}

export async function getCurrentAthleteAttendance(session?: AuthSession): Promise<Attendance[]> {
  if (dataSource === 'api') {
    return getAthleteAttendanceFromApi(session);
  }

  return mockAttendance
    .filter((item) => item.athleteId === currentAthleteId)
    .sort((left, right) => right.sessionDate.localeCompare(left.sessionDate));
}
