import Link from 'next/link';

import { AppContainer } from '@/components/layout/AppContainer';
import { Section } from '@/components/layout/Section';
import { PublicSectionHeading } from '@/components/public/PublicSectionHeading';

export default function ContactoPage() {
  return (
    <Section className="bg-[linear-gradient(180deg,#ffffff_0%,#f4f8ff_100%)]">
      <AppContainer className="grid gap-8 lg:grid-cols-[1fr_0.92fr]">
        <PublicSectionHeading
          eyebrow="Contacto"
          title="Cierra el recorrido con un siguiente paso claro"
          body="Esta pagina se deja simple y lista para que luego agreguen datos reales de WhatsApp, correo, formulario o CTA comercial sin volver a tocar la estructura visual."
        />
        <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="grid gap-5">
            {[
              ['Email', 'Agrega aqui el correo principal del box o del equipo comercial.'],
              ['WhatsApp', 'Agrega aqui el numero o link directo para atencion.'],
              ['Instagram', 'Agrega aqui la cuenta oficial para derivar trafico social.'],
            ].map(([title, body]) => (
              <article key={title} className="rounded-[1.35rem] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-primary)]">
                  {title}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{body}</p>
              </article>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full bg-[color:var(--color-primary)] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#0f6bff]"
            >
              Volver al landing
            </Link>
            <Link
              href="/testimonios"
              className="rounded-full border border-slate-200 bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-900 transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
            >
              Ver testimonios
            </Link>
          </div>
        </div>
      </AppContainer>
    </Section>
  );
}
