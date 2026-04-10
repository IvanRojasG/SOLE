import { AppContainer } from '@/components/layout/AppContainer';

export default function LeaderboardLoading() {
  return (
    <div className="py-[--section-spacing]">
      <AppContainer className="space-y-4">
        <div className="h-28 animate-pulse rounded-[2rem] bg-white/5" />
        <div className="h-24 animate-pulse rounded-[2rem] bg-white/5" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-56 animate-pulse rounded-[2rem] bg-white/5" />
          <div className="h-56 animate-pulse rounded-[2rem] bg-white/5" />
          <div className="h-56 animate-pulse rounded-[2rem] bg-white/5" />
        </div>
      </AppContainer>
    </div>
  );
}
