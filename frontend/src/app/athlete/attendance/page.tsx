import { AthleteAreaLayout } from '@/components/athlete/AthleteAreaLayout';
import { AthleteAttendanceView } from '@/components/pages/AthleteAttendanceView';
import { requireSession } from '@/services/auth/session';
import { getAthleteDashboard } from '@/services/repository/dashboardRepository';
import { getCurrentAthleteAttendance } from '@/services/repository/athleteRepository';

export default async function AthleteAttendancePage() {
  await requireSession('athlete', '/athlete/attendance');
  const [attendance, dashboard] = await Promise.all([
    getCurrentAthleteAttendance(),
    getAthleteDashboard(),
  ]);

  return (
    <AthleteAreaLayout
      activePath="/athlete/attendance"
      title="Asistencia del atleta"
      description="Vista resumida del historial de check-ins con lectura rápida de sesiones y continuidad mensual."
    >
      <AthleteAttendanceView attendance={attendance} streakDays={dashboard.athlete.streakDays} />
    </AthleteAreaLayout>
  );
}
