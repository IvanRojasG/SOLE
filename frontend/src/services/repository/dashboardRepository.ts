import { dataSource } from '@/lib/config/dataSource';
import type { AuthSession } from '@/services/auth/session';
import { mockAthleteDashboard } from '@/services/mocks/athleteDashboard';
import { getChallenges } from '@/services/repository/challengeRepository';
import {
  getCurrentAthleteAchievements,
  getCurrentAthleteProfile,
} from '@/services/repository/athleteRepository';
import { getRanking } from '@/services/repository/rankingRepository';
import type { AthleteDashboard } from '@/types';

async function getAthleteDashboardFromApi(
  session?: AuthSession,
): Promise<AthleteDashboard> {
  const [profile, achievements, challenges, ranking] =
    await Promise.all([
      getCurrentAthleteProfile(session),
      getCurrentAthleteAchievements(session),
      getChallenges(),
      getRanking(),
    ]);

  const currentRank =
    ranking.find((entry) => entry.athleteName === profile.fullName) ??
    ({
      athleteId: profile.athleteId,
      athleteName: profile.fullName,
      level: profile.level,
      rank: ranking.length + 1,
      points: 0,
      resultFormat: 'scaled',
      delta: 0,
      approvedAchievements: 0,
    } as const);

  const approvedAchievements = achievements.filter(
    (item) => item.status === 'approved',
  );

  return {
    athlete: {
      id: profile.athleteId,
      fullName: profile.fullName,
      level: profile.level,
      city: profile.city,
      favoriteFocus: profile.favoriteFocus,
      points: currentRank.points,
      achievementsApproved: approvedAchievements.length,
      avatarColor: '#f2c230',
      tagline: 'Sincronizado desde backend real.',
    },
    rank: {
      ...currentRank,
      approvedAchievements: approvedAchievements.length,
    },
    kpis: [
      {
        id: 'api-kpi-1',
        label: 'Puntos Open',
        value: String(currentRank.points),
        tone: 'primary',
      },
      {
        id: 'api-kpi-2',
        label: 'WODs aprobados',
        value: String(approvedAchievements.length),
        tone: 'secondary',
      },
      {
        id: 'api-kpi-3',
        label: 'Logros aprobados',
        value: String(approvedAchievements.length),
        tone: 'neutral',
      },
      {
        id: 'api-kpi-4',
        label: 'Ranking',
        value: `#${currentRank.rank}`,
        tone: 'primary',
      },
    ],
    activeChallenges: challenges.slice(0, 3),
    recentAchievements: achievements.slice(0, 3),
  };
}

export async function getAthleteDashboard(
  session?: AuthSession,
): Promise<AthleteDashboard> {
  if (dataSource === 'api') {
    return getAthleteDashboardFromApi(session);
  }

  return structuredClone(mockAthleteDashboard);
}
