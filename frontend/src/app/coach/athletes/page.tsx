import { CoachAreaLayout } from '@/components/coach/CoachAreaLayout';
import { CoachAthletesView } from '@/components/pages/CoachAthletesView';
import { requireSession } from '@/services/auth/session';
import { getCoachAthletes } from '@/services/repository/coachRepository';

export default async function CoachAthletesPage() {
  const session = await requireSession('coach', '/coach/athletes');
  const athletes = await getCoachAthletes(session);

  return (
    <CoachAreaLayout
      activePath="/coach/athletes"
      title="Gestión de atletas"
      description="Vista para búsqueda rápida, lectura comparativa y detalle contextual del atleta desde el panel coach."
    >
      <CoachAthletesView athletes={athletes} />
    </CoachAreaLayout>
  );
}
