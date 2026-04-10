import { AthleteAreaLayout } from '@/components/athlete/AthleteAreaLayout';
import { AthleteProfileView } from '@/components/pages/AthleteProfileView';
import { requireSession } from '@/services/auth/session';
import { getCurrentAthleteProfile } from '@/services/repository/athleteRepository';

export default async function AthleteProfilePage() {
  await requireSession('athlete', '/athlete/profile');
  const profile = await getCurrentAthleteProfile();

  return (
    <AthleteAreaLayout
      activePath="/athlete/profile"
      title="Perfil del atleta"
      description="Formulario visual editable para perfilar la identidad deportiva del atleta antes de persistencia real."
    >
      <AthleteProfileView profile={profile} />
    </AthleteAreaLayout>
  );
}
