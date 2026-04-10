import type { Athlete } from '@/types';

export function adaptAthletes(athletes: Athlete[]): Athlete[] {
  return [...athletes].sort((left, right) => right.points - left.points || left.fullName.localeCompare(right.fullName));
}
