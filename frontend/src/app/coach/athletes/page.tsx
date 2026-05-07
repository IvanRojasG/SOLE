import { CoachAreaLayout } from '@/components/coach/CoachAreaLayout';
import { CoachAthletesView } from '@/components/pages/CoachAthletesView';
import { requireSession } from '@/services/auth/session';
import { getChallenges } from '@/services/repository/challengeRepository';
import { getCoachAthletes } from '@/services/repository/coachRepository';

export default async function CoachAthletesPage() {
  const session = await requireSession('coach', '/coach/athletes');
  const [athletes, challenges] = await Promise.all([
    getCoachAthletes(session),
    getChallenges(),
  ]);

  return (
    <CoachAreaLayout
      activePath="/coach/athletes"
      title="Gestión de atletas"
      description="Vista para búsqueda rápida, lectura comparativa y detalle contextual del atleta desde el panel coach."
    >
      <CoachAthletesView athletes={athletes} challenges={challenges} />
    </CoachAreaLayout>
  );
}
