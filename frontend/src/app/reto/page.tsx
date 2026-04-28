import { PublicDetailPage } from '@/components/public/PublicDetailPage';
import { publicSite } from '@/content/publicSite';

export default function RetoPage() {
  return (
    <PublicDetailPage
      eyebrow="The Challenge"
      title="El reto, semana por semana"
      intro="La pagina de informacion del reto baja el mensaje principal a un formato facil de recorrer: fechas, intensidad esperada y el cierre competitivo de junio."
      cards={publicSite.schedule.map((item) => ({
        title: item.label,
        body: item.value,
      }))}
      cta={{ label: 'Ver impacto', href: '/impacto' }}
    />
  );
}
