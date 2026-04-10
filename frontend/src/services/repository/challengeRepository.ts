import { dataSource } from '@/lib/config/dataSource';
import { backendRequest } from '@/services/api/backend';
import { mockChallenges } from '@/services/mocks/challenges';
import type { Challenge } from '@/types';

async function getChallengesFromApi(): Promise<Challenge[]> {
  const payload = await backendRequest<
    Array<{
      id: string;
      title: string;
      category: Challenge['category'];
      difficulty: Challenge['difficulty'];
      summary: string;
      window_label: string;
      is_active: boolean;
      points: number;
    }>
  >('/challenges');

  return payload.map((challenge) => ({
    id: challenge.id,
    title: challenge.title,
    points: challenge.points,
    category: challenge.category,
    difficulty: challenge.difficulty,
    summary: challenge.summary,
    windowLabel: challenge.window_label,
  }));
}

export async function getChallenges(): Promise<Challenge[]> {
  if (dataSource === 'api') {
    return getChallengesFromApi();
  }

  return [...mockChallenges];
}
