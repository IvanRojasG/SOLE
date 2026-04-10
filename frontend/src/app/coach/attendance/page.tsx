import { CoachAreaLayout } from '@/components/coach/CoachAreaLayout';
import { CoachAttendanceView } from '@/components/pages/CoachAttendanceView';
import { requireSession } from '@/services/auth/session';
import {
  getCoachAthletes,
  getCoachAttendanceSessions,
} from '@/services/repository/coachRepository';

export default async function CoachAttendancePage() {
  await requireSession('coach', '/coach/attendance');
  const [athletes, sessions] = await Promise.all([
    getCoachAthletes(),
    getCoachAttendanceSessions(),
  ]);

  return (
    <CoachAreaLayout
      activePath="/coach/attendance"
      title="Asistencia coach"
      description="Creación visual de sesiones y control de check-in por atleta, sin conexión a backend todavía."
    >
      <CoachAttendanceView athletes={athletes} sessions={sessions} />
    </CoachAreaLayout>
  );
}
