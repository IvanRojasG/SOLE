import { ChallengesView } from '@/components/pages/ChallengesView';
import { PageHero } from '@/components/shared/PageHero';
import { getChallenges } from '@/services/repository/challengeRepository';

export default async function ChallengesPage() {
  const challenges = await getChallenges();

  return (
    <>
      <PageHero
        eyebrow="Challenges"
        title="Retos del mes"
        description="Catálogo visual del reto mensual con categorías, puntaje y dificultad. La información se sirve desde repositorios desacoplados."
      />
      <ChallengesView challenges={challenges} />
    </>
  );
}
