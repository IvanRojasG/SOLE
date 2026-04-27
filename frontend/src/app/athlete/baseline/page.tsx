import { AthleteAreaLayout } from '@/components/athlete/AthleteAreaLayout';
import { AthleteBaselineView } from '@/components/pages/AthleteBaselineView';
import { requireSession } from '@/services/auth/session';
import { getCurrentAthleteBaseline } from '@/services/repository/athleteRepository';

export default async function AthleteBaselinePage() {
  const session = await requireSession('athlete', '/athlete/baseline');
  const baseline = await getCurrentAthleteBaseline(session);

  return (
    <AthleteAreaLayout
      activePath="/athlete/baseline"
      title="Baseline inicial"
      description="Edición visual de PRs y skills con posibilidad de bloqueo local para representar el flujo final del producto."
    >
      <AthleteBaselineView baseline={baseline} />
    </AthleteAreaLayout>
  );
}
