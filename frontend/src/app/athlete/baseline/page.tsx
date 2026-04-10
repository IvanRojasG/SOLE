import { AthleteAreaLayout } from '@/components/athlete/AthleteAreaLayout';
import { AthleteBaselineView } from '@/components/pages/AthleteBaselineView';
import { requireSession } from '@/services/auth/session';
import { getCurrentAthleteBaseline } from '@/services/repository/athleteRepository';

export default async function AthleteBaselinePage() {
  await requireSession('athlete', '/athlete/baseline');
  const baseline = await getCurrentAthleteBaseline();

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
