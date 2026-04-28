'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { brand } from '@/lib/config/brand';
import { logoutAction } from '@/services/auth/actions';
import type { AuthSession } from '@/services/auth/session';

import { AppContainer } from './AppContainer';
import { MobileDrawerNav } from './MobileDrawerNav';

type PublicTopNavProps = {
  session: AuthSession | null;
};

export function PublicTopNav({ session }: PublicTopNavProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dashboardHref = session?.user.role === 'coach' ? '/coach' : '/athlete/profile';

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/90 backdrop-blur-2xl">
        <AppContainer className="flex h-[--nav-height] items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3" aria-label="Ir al inicio de SOLE Fitness">
            <div className="rounded-[1.2rem] border border-slate-200 bg-white px-3 py-2 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <Image
                src={brand.assets.officialBlue}
                alt={brand.name}
                width={112}
                height={48}
                priority
                className="h-auto w-auto"
              />
            </div>
          </Link>

          <nav aria-label="Navegacion principal" className="hidden items-center gap-7 md:flex">
            {brand.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 transition hover:text-[color:var(--color-primary)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {session ? (
              <>
                <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-right shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                    Sesion activa
                  </p>
                  <p className="text-sm font-semibold text-slate-900">{session.user.email}</p>
                </div>
                <a
                  href={dashboardHref}
                  className="rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-900 transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                >
                  Mi panel
                </a>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="rounded-full bg-[color:var(--color-primary)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#0f6bff]"
                  >
                    Salir
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-900 transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                >
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-[color:var(--color-primary)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#0f6bff]"
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white md:hidden"
            aria-label="Abrir menu"
            aria-expanded={isDrawerOpen}
            aria-controls="mobile-drawer-nav"
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 bg-slate-900" />
              <span className="block h-0.5 w-5 bg-slate-900" />
              <span className="block h-0.5 w-5 bg-slate-900" />
            </span>
          </button>
        </AppContainer>
      </header>
      <MobileDrawerNav open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} session={session} />
    </>
  );
}
