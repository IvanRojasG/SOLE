import { AttendanceHistoryList } from '@/components/athlete/AttendanceHistoryList';
import { AttendanceSummaryCards } from '@/components/athlete/AttendanceSummaryCards';
import { StreakCard } from '@/components/athlete/StreakCard';
import type { Attendance } from '@/types';

type AthleteAttendanceViewProps = {
  attendance: Attendance[];
  streakDays: number;
};

export function AthleteAttendanceView({ attendance, streakDays }: AthleteAttendanceViewProps) {
  return (
    <div className="space-y-6">
      <AttendanceSummaryCards attendance={attendance} />
      <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <StreakCard streakDays={streakDays} />
        <AttendanceHistoryList attendance={attendance} />
      </div>
    </div>
  );
}
