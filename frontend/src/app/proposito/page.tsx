import Image from 'next/image';

import { AppContainer } from '@/components/layout/AppContainer';
import { Section } from '@/components/layout/Section';

const coaches = [
  {
    name: 'Coach Mau',
    role: 'Head Coach',
    image: '/coaches/coach-mau.jpg',
    accent: 'from-blue-600 to-cyan-500',
    who: `Soy un coach de alto nivel especializado en CrossFit y desarrollo humano.
Mi misión es formar personas fuertes —no solo físicamente, sino mental y espiritualmente— capaces de liderar su vida con disciplina, carácter y propósito.
A través de entrenamiento estructurado, comunidad y principios sólidos, ayudo a individuos a convertirse en personas difíciles de romper: resilientes, responsables y comprometidas con su crecimiento.
Creo en el trabajo duro, la fe como guía, y en construir una comunidad donde el respeto, la excelencia y el servicio no son negociables.`,
    mission:
      'Transformar la vida de mis clientes a través de entrenamiento de alto nivel, educación y comunidad, desarrollando fuerza física, mental y espiritual en un ambiente seguro, exigente y profundamente humano.',
    vision:
      'Convertirme en un referente en Latinoamérica en la formación de individuos fuertes y resilientes, combinando fitness, carácter y fe; creando una comunidad que eleve el estándar de lo que significa vivir con disciplina, propósito y responsabilidad.',
  },
  {
    name: 'Coach Chilli',
    role: 'Coach',
    image: '/coaches/coach-chilli.jpg',
    accent: 'from-orange-500 to-amber-300',
    who:
      'Soy parte del equipo que empuja la intensidad diaria, conecta con los atletas en el piso y ayuda a que cada sesión tenga foco, energía y ejecución real.',
    mission:
      'Acompañar a la comunidad para que cada atleta llegue preparado, motivado y consciente de lo que puede mejorar semana a semana.',
    vision:
      'Hacer que el reto se sienta cercano, competitivo y memorable, donde cada participante encuentre una razón concreta para subir su nivel.',
  },
] as const;

export default function PropositoPage() {
  return (
    <Section className="bg-[linear-gradient(180deg,#ffffff_0%,#f4f8ff_48%,#ffffff_100%)]">
      <AppContainer className="space-y-12">
        <div className="max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-primary)]">
            Proposito
          </p>
          <h1 className="mt-4 font-display text-5xl uppercase leading-[0.9] tracking-[0.06em] text-slate-950 sm:text-6xl lg:text-7xl">
            Coaches que guian el reto
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
            Esta pagina presenta el rol de los coaches dentro de Burn the Ships!: quienes son, que
            buscan construir y como sostienen la mision y vision del reto.
          </p>
        </div>

        <div className="grid gap-8">
          {coaches.map((coach, index) => (
            <article
              key={coach.name}
              className="grid overflow-hidden rounded-[2.25rem] border border-slate-200/90 bg-white/95 shadow-[0_28px_90px_rgba(15,23,42,0.1)] lg:grid-cols-[0.92fr_1.08fr]"
            >
              <div
                className={`relative min-h-[24rem] bg-gradient-to-br ${coach.accent} ${
                  index % 2 === 1 ? 'lg:order-2' : ''
                }`}
              >
                <Image
                  src={coach.image}
                  alt={`${coach.name} de SOLE Fitness`}
                  fill
                  sizes="(min-width: 1024px) 44vw, 100vw"
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04),rgba(15,23,42,0.68))]" />
                <div className="relative flex h-full min-h-[24rem] flex-col justify-end p-8 text-white">
                  <div>
                    <p className="font-display text-6xl uppercase leading-none tracking-[0.04em]">
                      {coach.name}
                    </p>
                    <p className="mt-3 text-sm font-semibold uppercase tracking-[0.22em] text-white/80">
                      {coach.role}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 p-6 sm:p-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-primary)]">
                    Quien soy
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-950">{coach.name}</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{coach.who}</p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-slate-300/80 bg-white p-5 shadow-[0_18px_48px_rgba(15,23,42,0.07)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Mision
                    </p>
                    <p className="mt-4 text-sm leading-7 text-slate-700">{coach.mission}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-300/80 bg-white p-5 shadow-[0_18px_48px_rgba(15,23,42,0.07)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Vision
                    </p>
                    <p className="mt-4 text-sm leading-7 text-slate-700">{coach.vision}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </AppContainer>
    </Section>
  );
}
