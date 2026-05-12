import Image from 'next/image';
import type { ReactNode } from 'react';

import { AppContainer } from '@/components/layout/AppContainer';
import { Section } from '@/components/layout/Section';
import { CoachImageCarousel } from '@/components/public/CoachImageCarousel';

type CoachCardIcon = 'spark' | 'target' | 'compass';

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
    gallery: [
      { src: '/coaches/coach-chilli.jpg', alt: 'Coach Chilli de SOLE Fitness' },
      {
        src: '/coaches/chilli-carousel/chilli-01.jpg',
        alt: 'Coach Chilli guiando entrenamiento funcional',
      },
      {
        src: '/coaches/chilli-carousel/chilli-02.jpg',
        alt: 'Coach Chilli en sesión de fuerza y movimiento',
      },
      {
        src: '/coaches/chilli-carousel/chilli-03.jpg',
        alt: 'Coach Chilli acompañando atletas de SOLE Fitness',
      },
      {
        src: '/coaches/chilli-carousel/chilli-04.jpg',
        alt: 'Coach Chilli en entrenamiento con la comunidad',
      },
      {
        src: '/coaches/chilli-carousel/chilli-05.jpg',
        alt: 'Coach Chilli corrigiendo técnica de movimiento',
      },
      {
        src: '/coaches/chilli-carousel/chilli-06.jpg',
        alt: 'Coach Chilli durante una sesión de SOLE Fitness',
      },
      {
        src: '/coaches/chilli-carousel/chilli-07.jpg',
        alt: 'Coach Chilli trabajando fuerza funcional',
      },
      {
        src: '/coaches/chilli-carousel/chilli-08.jpg',
        alt: 'Coach Chilli guiando una clase',
      },
      {
        src: '/coaches/chilli-carousel/chilli-09.jpg',
        alt: 'Coach Chilli en proceso de entrenamiento',
      },
      {
        src: '/coaches/chilli-carousel/chilli-10.jpg',
        alt: 'Coach Chilli acompañando el reto',
      },
      {
        src: '/coaches/chilli-carousel/chilli-11.jpg',
        alt: 'Coach Chilli representando SOLE Fitness',
      },
    ],
    accent: 'from-orange-500 to-amber-300',
    who:
      'Soy una terapeuta física en formación y atleta de alto rendimiento apasionada por el movimiento humano, la fuerza funcional y la salud integral. Mi trayectoria combina la ciencia de la rehabilitación con años de experiencia competitiva en disciplinas como halterofilia, atletismo, CrossFit y natación, permitiéndome comprender el cuerpo tanto desde la perspectiva clínica como desde la experiencia real del entrenamiento y el rendimiento deportivo. Creo profundamente en el movimiento consciente como una herramienta para mejorar la calidad de vida, prevenir lesiones y desarrollar resiliencia física y mental. Mi enfoque integra fuerza, movilidad, control motor y educación corporal, promoviendo procesos sostenibles y respetuosos con las necesidades individuales de cada persona.',
    mission:
      'Ayudar a las personas a moverse mejor mediante la integración de fuerza funcional, rehabilitación y movimiento consciente, promoviendo salud, prevención de lesiones y bienestar integral desde un enfoque humano, técnico y respetuoso del cuerpo.',
    vision:
      'Ser una referente en fuerza consciente y movimiento terapéutico, integrando el alto rendimiento deportivo y la terapia física para impactar positivamente la salud, el rendimiento y la calidad de vida de las personas.',
  },
] as const;

function CoachIcon({ name }: { name: CoachCardIcon }) {
  const icons: Record<CoachCardIcon, ReactNode> = {
    spark: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none">
        <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    ),
    target: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none">
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    ),
    compass: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none">
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    ),
  };

  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_14px_34px_rgba(15,23,42,0.18)]">
      {icons[name]}
    </span>
  );
}

export default function PropositoPage() {
  return (
    <Section className="bg-[linear-gradient(180deg,#ffffff_0%,#eef7ff_38%,#fff7ed_72%,#ffffff_100%)]">
      <AppContainer className="space-y-12">
        <div className="sole-hatch relative overflow-hidden rounded-[1.5rem] border border-slate-200/90 bg-[linear-gradient(135deg,#ffffff_0%,#eef7ff_52%,#f0fdfa_100%)] p-7 shadow-[0_28px_90px_rgba(15,23,42,0.1)] sm:p-9">
          <div className="relative max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-primary)]">
            Propósito
          </p>
          <h1 className="mt-4 font-display text-5xl uppercase leading-[0.9] tracking-[0.06em] text-slate-950 sm:text-6xl lg:text-7xl">
            Coaches que guían el reto
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
            Esta página presenta el rol de los coaches dentro de Burn the Ships!: quiénes son, qué
            buscan construir y cómo sostienen la misión y visión del reto.
          </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {['Fuerza con intención', 'Comunidad presente', 'Proceso sostenible'].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-slate-950 px-4 py-2 text-xs font-bold tracking-[0.16em] text-white uppercase"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          {coaches.map((coach, index) => (
            <article
              key={coach.name}
              className="grid overflow-hidden rounded-[1.5rem] border border-slate-200/90 bg-white/95 shadow-[0_28px_90px_rgba(15,23,42,0.1)] lg:grid-cols-[0.9fr_1.1fr]"
            >
              <div
                className={`relative min-h-[24rem] bg-gradient-to-br ${coach.accent} ${
                  index % 2 === 1 ? 'lg:order-2' : ''
                }`}
              >
                {'gallery' in coach ? (
                  <CoachImageCarousel
                    slides={coach.gallery}
                    coachName={coach.name}
                    priority={index === 0}
                  />
                ) : (
                  <Image
                    src={coach.image}
                    alt={`${coach.name} de SOLE Fitness`}
                    fill
                    sizes="(min-width: 1024px) 44vw, 100vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                )}
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

              <div className="grid gap-5 bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_52%,#fff7ed_100%)] p-6 sm:p-8">
                <div className="rounded-[1.25rem] border border-slate-200 bg-white/85 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
                  <div className="flex items-center gap-3">
                    <CoachIcon name="spark" />
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-primary)]">
                      Quién soy
                    </p>
                  </div>
                  <h2 className="mt-4 text-3xl font-semibold text-slate-950">{coach.name}</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {coach.who}
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="rounded-[1.25rem] border border-teal-200 bg-teal-50/90 p-5 shadow-[0_18px_48px_rgba(8,145,178,0.08)]">
                    <div className="flex items-center gap-3">
                      <CoachIcon name="target" />
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-800">
                        Misión
                      </p>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-700">{coach.mission}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50/95 p-5 shadow-[0_18px_48px_rgba(245,158,11,0.1)]">
                    <div className="flex items-center gap-3">
                      <CoachIcon name="compass" />
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-900">
                        Visión
                      </p>
                    </div>
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
