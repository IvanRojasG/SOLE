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
      summary: string;
      start_date: string;
      end_date: string;
      youtube_url: string;
      total_reps: number;
      is_active: boolean;
    }>
  >('/challenges');

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

export async function getChallenges(): Promise<Challenge[]> {
  if (dataSource === 'api') {
    return getChallengesFromApi();
  }

  return [...mockChallenges];
}
