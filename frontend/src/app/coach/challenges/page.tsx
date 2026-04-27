import { CoachAreaLayout } from '@/components/coach/CoachAreaLayout';
import { CoachChallengesView } from '@/components/pages/CoachChallengesView';
import { requireSession } from '@/services/auth/session';
import { getChallengeManagementItems } from '@/services/repository/coachRepository';

export default async function CoachChallengesPage() {
  const session = await requireSession('coach', '/coach/challenges');
  const items = await getChallengeManagementItems(session);

  return (
    <CoachAreaLayout
      activePath="/coach/challenges"
      title="Gestión de retos"
      description="Vista de administración visual de retos activos y editor desacoplado para ajustes previos a integración real."
    >
      <CoachChallengesView items={items} />
    </CoachAreaLayout>
  );
}
