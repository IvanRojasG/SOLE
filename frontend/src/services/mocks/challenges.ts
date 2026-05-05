import type { Challenge } from '@/types';

export const mockChallenges: Challenge[] = [
  {
    id: 'cha-01',
    title: 'Metcon AMRAP 12',
    category: 'custom_metcon_reps',
    summary: 'Completa la mayor cantidad de repeticiones dentro del estándar del WOD.',
    startDate: '2026-05-01',
    endDate: '2026-05-07',
    youtubeUrl: 'https://www.youtube.com/watch?v=8sNchaX9Auc',
    totalReps: 180,
    isActive: true,
  },
  {
    id: 'cha-02',
    title: 'Power lifting ladder',
    category: 'power_lifting',
    summary: 'Registra repeticiones y carga; las repeticiones definen la posición y el peso desempata.',
    startDate: '2026-05-08',
    endDate: '2026-05-14',
    youtubeUrl: 'https://www.youtube.com/watch?v=GFUImejEQ2s',
    totalReps: 40,
    isActive: true,
  },
];
