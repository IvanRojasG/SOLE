import Image from 'next/image';
import Link from 'next/link';

import { AppContainer } from '@/components/layout/AppContainer';
import { Section } from '@/components/layout/Section';
import { PublicSectionHeading } from '@/components/public/PublicSectionHeading';

const contactItems = [
  {
    title: 'WhatsApp',
    body: '+506 8767 0860',
    href: 'https://wa.me/50687670860',
    action: 'Escribir por WhatsApp',
    icon: 'chat',
    accent: 'from-emerald-500 to-teal-400',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
  },
  {
    title: 'Email',
    body: 'solefit22@gmail.com',
    href: 'mailto:solefit22@gmail.com',
    action: 'Enviar correo',
    icon: 'mail',
    accent: 'from-sky-600 to-blue-400',
    border: 'border-sky-200',
    text: 'text-sky-700',
  },
  {
    title: 'Instagram',
    body: '@solefitnesscr',
    href: 'https://instagram.com/solefitnesscr',
    action: 'Ver Instagram',
    icon: 'camera',
    accent: 'from-fuchsia-500 to-rose-400',
    border: 'border-fuchsia-200',
    text: 'text-fuchsia-700',
  },
] as const;

function ContactIcon({
  name,
}: {
  name: (typeof contactItems)[number]['icon'];
}) {
  if (name === 'mail') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-6 w-6"
        fill="none"
      >
        <path d="M4 7.5h16v10H4v-10Z" stroke="currentColor" strokeWidth="2" />
        <path d="m5 8 7 5 7-5" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (name === 'camera') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-6 w-6"
        fill="none"
      >
        <rect
          x="4"
          y="5"
          width="16"
          height="16"
          rx="5"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M17 8.5h.01"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none">
      <path
        d="M5 19.5 6.2 16A7.5 7.5 0 1 1 9 18.1L5 19.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M9 10.2c1.2 2.4 2.4 3.6 4.8 4.8l1.2-1.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function ContactoPage() {
  return (
    <Section className="bg-[linear-gradient(180deg,#ffffff_0%,#eef7ff_45%,#f8fbff_100%)]">
      <AppContainer className="space-y-8">
        <div className="max-w-4xl">
          <PublicSectionHeading
            eyebrow="Contacto"
            title="Conecta directo con SOLE Fitness"
            body="Escríbenos por WhatsApp, correo o Instagram para resolver dudas del reto, coordinar seguimiento o activar el siguiente paso con el equipo."
          />
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <div className="relative min-h-[28rem] overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:min-h-[42rem]">
            <Image
              src="/contact/contact-photo.jpg"
              alt="Comunidad de SOLE Fitness"
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <div className="grid gap-5">
              {contactItems.map((item) => (
                <article
                  key={item.title}
                  className={`rounded-[1.35rem] border ${item.border} bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_58%,#eef6ff_100%)] p-5 shadow-[0_16px_38px_rgba(15,23,42,0.06)]`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-[0_14px_30px_rgba(15,23,42,0.12)]`}
                    >
                      <ContactIcon name={item.icon} />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-semibold tracking-[0.24em] uppercase ${item.text}`}
                      >
                        {item.title}
                      </p>
                      <p className="mt-3 text-lg font-semibold break-words text-slate-950">
                        {item.body}
                      </p>
                    </div>
                  </div>
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={
                      item.href.startsWith('http') ? 'noreferrer' : undefined
                    }
                    className={`mt-5 inline-flex rounded-full border bg-white px-4 py-2 text-xs font-bold tracking-[0.18em] uppercase transition ${item.border} ${item.text} hover:bg-slate-950 hover:text-white`}
                  >
                    {item.action}
                  </a>
                </article>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full bg-[color:var(--color-primary)] px-6 py-3 text-xs font-bold tracking-[0.18em] text-white uppercase transition hover:bg-[#0f6bff]"
              >
                Volver al landing
              </Link>
              <Link
                href="/testimonios"
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-xs font-bold tracking-[0.18em] text-slate-900 uppercase transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
              >
                Ver testimonios
              </Link>
            </div>
          </div>
        </div>
      </AppContainer>
    </Section>
  );
}
