import { ActiveChallengesPanel } from '@/components/athlete/ActiveChallengesPanel';
import { AthleteProgressCard } from '@/components/athlete/AthleteProgressCard';
import { KPIStatRow } from '@/components/athlete/KPIStatRow';
import { RankHighlightCard } from '@/components/athlete/RankHighlightCard';
import { RecentAchievementsPanel } from '@/components/athlete/RecentAchievementsPanel';
import { WelcomeBanner } from '@/components/athlete/WelcomeBanner';
import type { AthleteDashboard } from '@/types';

type AthleteDashboardViewProps = {
  dashboard: AthleteDashboard;
};

export function AthleteDashboardView({ dashboard }: AthleteDashboardViewProps) {
  return (
    <div className="space-y-6 lg:space-y-8">
      <WelcomeBanner dashboard={dashboard} />
      <KPIStatRow items={dashboard.kpis} />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <AthleteProgressCard dashboard={dashboard} />
        <RankHighlightCard rank={dashboard.rank} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <ActiveChallengesPanel challenges={dashboard.activeChallenges} />
        <RecentAchievementsPanel achievements={dashboard.recentAchievements} />
      </div>
    </div>
  );
}
