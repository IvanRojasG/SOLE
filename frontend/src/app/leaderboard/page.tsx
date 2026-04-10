import { PageHero } from '@/components/shared/PageHero';
import { LeaderboardView } from '@/components/pages/LeaderboardView';
import { getRanking } from '@/services/repository/rankingRepository';

export default async function LeaderboardPage() {
  const entries = await getRanking();

  return (
    <>
      <PageHero
        eyebrow="Leaderboard"
        title="Ranking público"
        description="Vista pública del rendimiento relativo del reto. Los datos vienen de la capa desacoplada y hoy operan con mocks conmutables por datasource."
      />
      <LeaderboardView entries={entries} />
    </>
  );
}
