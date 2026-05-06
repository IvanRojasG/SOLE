import type { RankingEntry } from '@/types';

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function getScoreLabel(entry: RankingEntry): string {
  if (entry.rankingView === 'event') {
    return `${entry.points} puntos`;
  }
  if (entry.completed && entry.timeSeconds != null) {
    return formatTime(entry.timeSeconds);
  }
  if (entry.repsCompleted != null) {
    return `${entry.repsCompleted} reps`;
  }
  return 'Sin registro';
}

export function getStatusLabel(entry: RankingEntry): string {
  if (entry.rankingView === 'event') {
    return `${entry.wodsScored ?? 0} WODs`;
  }
  if (entry.completed) {
    return 'Completado';
  }
  if (entry.repsCompleted != null) {
    return 'Parcial';
  }
  return 'Pendiente';
}
