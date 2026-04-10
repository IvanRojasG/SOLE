import { AppContainer } from '@/components/layout/AppContainer';

export default function ChallengesLoading() {
  return (
    <div className="py-[--section-spacing]">
      <AppContainer className="space-y-4">
        <div className="h-28 animate-pulse rounded-[2rem] bg-white/5" />
        <div className="h-16 animate-pulse rounded-[2rem] bg-white/5" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="h-64 animate-pulse rounded-[2rem] bg-white/5" />
          <div className="h-64 animate-pulse rounded-[2rem] bg-white/5" />
          <div className="h-64 animate-pulse rounded-[2rem] bg-white/5" />
        </div>
      </AppContainer>
    </div>
  );
}
