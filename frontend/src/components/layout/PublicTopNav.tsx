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
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/[0.88] shadow-[0_16px_44px_rgba(15,23,42,0.05)] backdrop-blur-2xl">
        <AppContainer className="flex h-[--nav-height] items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Ir al inicio de SOLE Fitness">
            <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
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

          <nav aria-label="Navegación principal" className="hidden items-center gap-4 lg:flex xl:gap-6">
            {brand.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600 transition after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-[color:var(--color-secondary)] after:transition-all hover:text-slate-950 hover:after:w-full xl:text-xs xl:tracking-[0.2em]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex xl:gap-3">
            {session ? (
              <>
                <div className="max-w-[13rem] rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-right shadow-[0_12px_30px_rgba(15,23,42,0.06)] xl:max-w-[16rem] xl:px-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                    Sesión activa
                  </p>
                  <p className="truncate text-sm font-semibold text-slate-900">{session.user.email}</p>
                </div>
                <a
                  href={dashboardHref}
                  className="whitespace-nowrap rounded-full border border-slate-300 bg-white px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-900 transition hover:border-[color:var(--color-secondary)] hover:text-[color:var(--color-secondary)] xl:px-5 xl:text-xs xl:tracking-[0.18em]"
                >
                  Mi panel
                </a>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="whitespace-nowrap rounded-full bg-slate-950 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_34px_rgba(15,23,42,0.18)] transition hover:bg-[color:var(--color-primary)] xl:px-5 xl:text-xs xl:tracking-[0.18em]"
                  >
                    Salir
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="whitespace-nowrap rounded-full border border-slate-300 bg-white px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-900 transition hover:border-[color:var(--color-secondary)] hover:text-[color:var(--color-secondary)] xl:px-5 xl:text-xs xl:tracking-[0.18em]"
                >
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  className="whitespace-nowrap rounded-full bg-slate-950 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_34px_rgba(15,23,42,0.18)] transition hover:bg-[color:var(--color-primary)] xl:px-5 xl:text-xs xl:tracking-[0.18em]"
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-300 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] lg:hidden"
            aria-label="Abrir menú"
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
