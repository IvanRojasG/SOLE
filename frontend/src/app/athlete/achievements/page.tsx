import { AthleteAreaLayout } from '@/components/athlete/AthleteAreaLayout';
import { AthleteAchievementsView } from '@/components/pages/AthleteAchievementsView';
import { requireSession } from '@/services/auth/session';
import { getChallenges } from '@/services/repository/challengeRepository';
import { getCurrentAthleteAchievements } from '@/services/repository/athleteRepository';

export default async function AthleteAchievementsPage() {
  await requireSession('athlete', '/athlete/achievements');
  const [achievements, challenges] = await Promise.all([
    getCurrentAthleteAchievements(),
    getChallenges(),
  ]);

  return (
    <AthleteAreaLayout
      activePath="/athlete/achievements"
      title="Logros del atleta"
      description="Listado de logros con estados visuales y formulario local de envío para validar el flujo antes de integración real."
    >
      <AthleteAchievementsView achievements={achievements} challenges={challenges} />
    </AthleteAreaLayout>
  );
}
