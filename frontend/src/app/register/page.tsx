import Image from 'next/image';
import { redirect } from 'next/navigation';

import { AuthForm } from '@/components/auth/AuthForm';
import { AppContainer } from '@/components/layout/AppContainer';
import { brand } from '@/lib/config/brand';
import { getSession } from '@/services/auth/session';

export const dynamic = 'force-dynamic';

export default async function RegisterPage() {
  const session = await getSession();

  if (session) {
    redirect(session.user.role === 'coach' ? '/coach' : '/athlete/profile');
  }

  return (
    <section className="py-[--section-spacing]">
      <AppContainer>
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(0,92,255,0.16),rgba(255,255,255,0.03))] p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <div className="inline-flex rounded-[1.4rem] border border-white/10 bg-[rgba(250,250,250,0.92)] px-5 py-4">
              <Image src={brand.assets.officialBlue} alt={brand.name} width={168} height={72} priority />
            </div>
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-primary-soft)]">
              Registro
            </p>
            <h1 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white sm:text-5xl">
              Crea tu cuenta de atleta
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[color:var(--color-text-muted)]">
              El registro consume el backend existente. Al completar el alta, la sesión se abre y
              el usuario entra directamente al dashboard del atleta.
            </p>
            <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-[rgba(6,21,47,0.42)] p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-secondary-soft)]">
                Onboarding
              </p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-muted)]">
                La cuenta creada entra al flujo del atleta y queda lista para baseline, logros y
                asistencia desde el primer acceso.
              </p>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-[color:var(--color-surface)]/90 p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <AuthForm mode="register" />
          </div>
        </div>
      </AppContainer>
    </section>
  );
}
