import type { AthleteBaseline } from '@/types';

export const mockBaseline: AthleteBaseline = {
  athleteId: 'ath-03',
  locked: false,
  prs: [
    { id: 'pr-01', movementId: 'mov-01', movement: 'Back squat', unit: 'lb', value: 185 },
    { id: 'pr-02', movementId: 'mov-02', movement: 'Deadlift', unit: 'lb', value: 235 },
    { id: 'pr-03', movementId: 'mov-03', movement: 'Snatch', unit: 'lb', value: 105 },
    { id: 'pr-04', movementId: 'mov-04', movement: 'Pull-ups max', unit: 'reps', value: 12 },
  ],
  skills: [
    { id: 'sk-01', skillId: 'skill-01', name: 'Pull-ups', status: 'consistent' },
    { id: 'sk-02', skillId: 'skill-02', name: 'Double unders', status: 'mastered' },
    { id: 'sk-03', skillId: 'skill-03', name: 'Toes to bar', status: 'developing' },
    { id: 'sk-04', skillId: 'skill-04', name: 'Handstand hold', status: 'developing' },
    { id: 'sk-05', skillId: 'skill-05', name: 'Chest-to-bar', status: 'not_started' },
    { id: 'sk-06', skillId: 'skill-06', name: 'Bar muscle-up', status: 'not_started' },
  ],
};
