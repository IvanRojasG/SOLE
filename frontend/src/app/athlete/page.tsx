import { AthleteAreaLayout } from '@/components/athlete/AthleteAreaLayout';
import { AthleteDashboardView } from '@/components/pages/AthleteDashboardView';
import { requireSession } from '@/services/auth/session';
import { getAthleteDashboard } from '@/services/repository/dashboardRepository';

export default async function AthleteDashboardPage() {
  await requireSession('athlete', '/athlete');
  const dashboard = await getAthleteDashboard();

  return (
    <AthleteAreaLayout
      activePath="/athlete"
      title="Dashboard del atleta"
      description="Vista principal del atleta con métricas del mes, posición relativa, retos activos y actividad reciente."
    >
      <AthleteDashboardView dashboard={dashboard} />
    </AthleteAreaLayout>
  );
}
