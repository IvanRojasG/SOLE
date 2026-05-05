import { AppContainer } from '@/components/layout/AppContainer';
import { Section } from '@/components/layout/Section';
import { LeaderboardView } from '@/components/pages/LeaderboardView';
import { getRanking } from '@/services/repository/rankingRepository';

export default async function LeaderboardPage() {
  const entries = await getRanking();

  return (
    <div className="bg-[linear-gradient(180deg,#ffffff_0%,#f4f8ff_45%,#ffffff_100%)] text-slate-950">
      <Section className="pt-10 pb-10 md:pb-12">
        <AppContainer>
          <div className="max-w-5xl rounded-[2.25rem] border border-slate-200/90 bg-white/90 p-7 shadow-[0_26px_80px_rgba(15,23,42,0.09)] md:p-9">
            <p className="text-xs font-semibold tracking-[0.28em] text-[color:var(--color-primary)] uppercase">
              Leaderboard
            </p>
            <h1 className="font-display mt-4 text-5xl leading-[0.9] tracking-[0.06em] text-slate-950 uppercase sm:text-6xl lg:text-7xl">
              Ranking público
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 md:text-base lg:text-lg">
              Vista pública del rendimiento relativo del reto. El leaderboard
              muestra los puntos por posición acumulados durante el mes. Menos puntos es mejor.
            </p>
          </div>
        </AppContainer>
      </Section>
      <LeaderboardView entries={entries} />
    </div>
  );
}
