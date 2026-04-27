import { CoachAreaLayout } from '@/components/coach/CoachAreaLayout';
import { CoachBaselineView } from '@/components/pages/CoachBaselineView';
import { requireSession } from '@/services/auth/session';
import { getBaselineCatalog } from '@/services/repository/baselineCatalogRepository';

export default async function CoachBaselinePage() {
  const session = await requireSession('coach', '/coach/baseline');
  const items = await getBaselineCatalog(session);

  return (
    <CoachAreaLayout
      activePath="/coach/baseline"
      title="Baseline"
      description="Define los RM, WODs, skills y mediciones que cada atleta debe completar en su baseline."
    >
      <CoachBaselineView items={items} />
    </CoachAreaLayout>
  );
}
