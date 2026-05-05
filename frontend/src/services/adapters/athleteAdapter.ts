import type { Athlete } from '@/types';

export function adaptAthletes(athletes: Athlete[]): Athlete[] {
  return [...athletes].sort(
    (left, right) =>
      (left.points === 0 ? 1 : 0) - (right.points === 0 ? 1 : 0) ||
      left.points - right.points ||
      left.fullName.localeCompare(right.fullName),
  );
}
