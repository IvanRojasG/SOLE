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
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[color:var(--color-ink)]/78 backdrop-blur-2xl">
        <AppContainer className="flex h-[--nav-height] items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3" aria-label="Ir al inicio de SOLE Fitness">
            <div className="rounded-[1.2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(0,92,255,0.22),rgba(250,250,250,0.04))] px-3 py-2 shadow-[var(--shadow-soft)]">
              <Image
                src={brand.assets.officialWhiteCropped}
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
                className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-muted)] transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {session ? (
              <>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-right shadow-[var(--shadow-soft)]">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-text-muted)]">
                    Sesion activa
                  </p>
                  <p className="text-sm font-semibold text-white">{session.user.email}</p>
                </div>
                <a
                  href={dashboardHref}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:border-[color:var(--color-secondary)] hover:bg-white/10 hover:text-[color:var(--color-secondary-soft)]"
                >
                  Mi panel
                </a>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="rounded-full bg-[color:var(--color-primary)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--color-text)] transition hover:bg-[color:var(--color-primary-soft)]"
                  >
                    Salir
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:border-[color:var(--color-secondary)] hover:bg-white/10 hover:text-[color:var(--color-secondary-soft)]"
                >
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-[color:var(--color-primary)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--color-text)] transition hover:bg-[color:var(--color-primary-soft)]"
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/5 md:hidden"
            aria-label="Abrir menu"
            aria-expanded={isDrawerOpen}
            aria-controls="mobile-drawer-nav"
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
            </span>
          </button>
        </AppContainer>
      </header>
      <MobileDrawerNav open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} session={session} />
    </>
  );
}
