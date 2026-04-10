import { AthletesView } from '@/components/pages/AthletesView';
import { PageHero } from '@/components/shared/PageHero';
import { getAthletes } from '@/services/repository/athleteRepository';

export default async function AthletesPage() {
  const athletes = await getAthletes();

  return (
    <>
      <PageHero
        eyebrow="Athletes"
        title="Comunidad atleta"
        description="Directorio público de atletas con foco en presencia, consistencia y lectura rápida del perfil competitivo. Sin acceso directo a datos desde componentes."
      />
      <AthletesView athletes={athletes} />
    </>
  );
}
