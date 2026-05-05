import { KPIStatRow } from '@/components/coach/KPIStatRow';
import { PendingApprovalsCard } from '@/components/coach/PendingApprovalsCard';
import { TopAthletesPanel } from '@/components/coach/TopAthletesPanel';
import type { CoachDashboard } from '@/types';

type CoachDashboardViewProps = {
  dashboard: CoachDashboard;
};

export function CoachDashboardView({ dashboard }: CoachDashboardViewProps) {
  return (
    <div className="space-y-6 lg:space-y-8">
      <KPIStatRow items={dashboard.kpis} />
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-8">
        <PendingApprovalsCard items={dashboard.pendingApprovals} />
        <TopAthletesPanel athletes={dashboard.topAthletes} />
      </div>
    </div>
  );
}
