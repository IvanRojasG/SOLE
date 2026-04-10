import type { Attendance } from '@/types';

export const mockAttendance: Attendance[] = [
  { id: 'att-01', athleteId: 'ath-01', sessionDate: '2026-04-01', checkedIn: true },
  { id: 'att-02', athleteId: 'ath-01', sessionDate: '2026-04-03', checkedIn: true },
  { id: 'att-03', athleteId: 'ath-02', sessionDate: '2026-04-01', checkedIn: true },
  { id: 'att-04', athleteId: 'ath-02', sessionDate: '2026-04-04', checkedIn: true },
  { id: 'att-05', athleteId: 'ath-03', sessionDate: '2026-04-02', checkedIn: true },
  { id: 'att-06', athleteId: 'ath-03', sessionDate: '2026-04-05', checkedIn: true },
  { id: 'att-07', athleteId: 'ath-04', sessionDate: '2026-04-02', checkedIn: true },
  { id: 'att-08', athleteId: 'ath-05', sessionDate: '2026-04-06', checkedIn: true },
  { id: 'att-09', athleteId: 'ath-06', sessionDate: '2026-04-06', checkedIn: true },
  { id: 'att-10', athleteId: 'ath-07', sessionDate: '2026-04-07', checkedIn: true },
  { id: 'att-11', athleteId: 'ath-08', sessionDate: '2026-04-08', checkedIn: true },
  { id: 'att-12', athleteId: 'ath-09', sessionDate: '2026-04-08', checkedIn: true },
  { id: 'att-13', athleteId: 'ath-10', sessionDate: '2026-04-09', checkedIn: true },
  { id: 'att-14', athleteId: 'ath-11', sessionDate: '2026-04-09', checkedIn: true },
  { id: 'att-15', athleteId: 'ath-12', sessionDate: '2026-04-10', checkedIn: true },
];
