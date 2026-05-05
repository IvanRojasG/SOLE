import { CoachAreaLayout } from '@/components/coach/CoachAreaLayout';
import { CoachAchievementsView } from '@/components/pages/CoachAchievementsView';
import { requireSession } from '@/services/auth/session';
import { getPendingAchievementReviews } from '@/services/repository/coachRepository';

export default async function CoachAchievementsPage() {
  const session = await requireSession('coach', '/coach/achievements');
  const items = await getPendingAchievementReviews(session);

  return (
    <CoachAreaLayout
      activePath="/coach/achievements"
      title="Resultados WOD"
      description="Validación y corrección de resultados que alimentan el leaderboard tipo Open."
    >
      <CoachAchievementsView items={items} />
    </CoachAreaLayout>
  );
}
