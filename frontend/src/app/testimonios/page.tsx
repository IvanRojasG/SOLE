import { AppContainer } from '@/components/layout/AppContainer';
import { Section } from '@/components/layout/Section';
import { PublicSectionHeading } from '@/components/public/PublicSectionHeading';
import { VideoTestimonialsGrid } from '@/components/public/VideoTestimonialsGrid';
import { publicSite } from '@/content/publicSite';

export default function TestimoniosPage() {
  return (
    <Section className="bg-[linear-gradient(180deg,#ffffff_0%,#f6faff_100%)]">
      <AppContainer className="space-y-10">
        <PublicSectionHeading
          eyebrow="Testimonials"
          title="Videos incrustados dentro de la pagina"
          body="La pagina queda conectada para mostrar testimonios de YouTube en un formato limpio. Solo reemplaza los links vacios por los enlaces reales."
        />
        <VideoTestimonialsGrid videos={publicSite.testimonials.videos} />
      </AppContainer>
    </Section>
  );
}
