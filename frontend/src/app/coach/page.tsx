import { CoachAreaLayout } from '@/components/coach/CoachAreaLayout';
import { CoachDashboardView } from '@/components/pages/CoachDashboardView';
import { requireSession } from '@/services/auth/session';
import { getCoachDashboard } from '@/services/repository/coachRepository';

export default async function CoachDashboardPage() {
  const session = await requireSession('coach', '/coach');
  const dashboard = await getCoachDashboard(session);

  return (
    <CoachAreaLayout
      activePath="/coach"
      title="Dashboard de coach"
      description="Panel operativo con visión rápida de aprobaciones, asistencia del día y atletas líderes del reto."
    >
      <CoachDashboardView dashboard={dashboard} />
    </CoachAreaLayout>
  );
}
