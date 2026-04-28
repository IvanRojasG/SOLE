import { PublicDetailPage } from '@/components/public/PublicDetailPage';
import { publicSite } from '@/content/publicSite';

export default function ImpactoPage() {
  return (
    <PublicDetailPage
      eyebrow="Impacto"
      title="Lo que este reto activa en la comunidad"
      intro={publicSite.impact.body}
      cards={publicSite.impact.points.map((point, index) => ({
        title: `Impacto ${index + 1}`,
        body: point,
      }))}
      cta={{ label: 'Ir a contacto', href: '/contacto' }}
    />
  );
}
