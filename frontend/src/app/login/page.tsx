import Image from 'next/image';
import { redirect } from 'next/navigation';

import { AuthForm } from '@/components/auth/AuthForm';
import { AppContainer } from '@/components/layout/AppContainer';
import { brand } from '@/lib/config/brand';
import { getSession } from '@/services/auth/session';

export const dynamic = 'force-dynamic';

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession();

  if (session) {
    redirect(session.user.role === 'coach' ? '/coach' : '/athlete/profile');
  }

  const params = await searchParams;
  const nextTarget = typeof params.next === 'string' ? params.next : undefined;

  return (
    <section className="py-[--section-spacing]">
      <AppContainer>
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,92,255,0.08))] p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <div className="inline-flex rounded-[1.4rem] border border-white/10 bg-[rgba(250,250,250,0.06)] px-5 py-4">
              <Image src={brand.assets.officialWhite} alt={brand.name} width={168} height={72} priority />
            </div>
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-secondary-soft)]">
              Acceso
            </p>
            <h1 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white sm:text-5xl">
              Entra a tu panel
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[color:var(--color-text-muted)]">
              Autenticación real contra el backend FastAPI. Desde aquí el atleta entra a su flujo y
              el coach a su panel operativo.
            </p>
            <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-[rgba(6,21,47,0.42)] p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-secondary-soft)]">
                Acceso seguro
              </p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-muted)]">
                Inicia sesión para operar el reto mensual con asistencia, logros, ranking y paneles
                diferenciados por rol.
              </p>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-[color:var(--color-surface)]/90 p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <AuthForm mode="login" nextTarget={nextTarget} />
          </div>
        </div>
      </AppContainer>
    </section>
  );
}
