'use client';

import Image from 'next/image';
import Link from 'next/link';

import { brand } from '@/lib/config/brand';
import { logoutAction } from '@/services/auth/actions';
import type { AuthSession } from '@/services/auth/session';
import { cn } from '@/lib/utils/cn';

type MobileDrawerNavProps = {
  open: boolean;
  onClose: () => void;
  session: AuthSession | null;
};

export function MobileDrawerNav({ open, onClose, session }: MobileDrawerNavProps) {
  const dashboardHref = session?.user.role === 'coach' ? '/coach' : '/athlete/profile';

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <aside
        id="mobile-drawer-nav"
        aria-hidden={!open}
        aria-label="Menu movil"
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-[84vw] max-w-sm flex-col border-l border-white/10 bg-[linear-gradient(180deg,rgba(12,36,92,0.98),rgba(6,21,47,0.98))] px-6 py-6 shadow-[var(--shadow-lift)] transition-transform duration-300 md:hidden',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="mb-10 flex items-center justify-between">
          <div className="rounded-[1.1rem] border border-white/10 bg-white/5 px-3 py-2">
            <Image
              src={brand.assets.officialWhiteCropped}
              alt={brand.name}
              width={96}
              height={42}
              priority
              className="h-auto w-auto"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white"
          >
            Cerrar
          </button>
        </div>
        <nav aria-label="Navegacion movil" className="flex flex-1 flex-col gap-4">
          {brand.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-[color:var(--color-primary)] hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
          {session ? (
            <>
              <a
                href={dashboardHref}
                onClick={onClose}
                className="rounded-2xl border border-[color:var(--color-secondary)]/40 bg-[color:var(--color-secondary)]/10 px-4 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[color:var(--color-secondary)]/20"
              >
                Mi panel
              </a>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full rounded-2xl border border-[color:var(--color-primary)]/40 bg-[color:var(--color-primary)]/14 px-4 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[color:var(--color-primary)]/20"
                >
                  Cerrar sesion
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
                className="rounded-2xl border border-[color:var(--color-secondary)]/40 bg-[color:var(--color-secondary)]/10 px-4 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[color:var(--color-secondary)]/20"
              >
                Ingresar
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="rounded-2xl border border-[color:var(--color-primary)]/40 bg-[color:var(--color-primary)]/10 px-4 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[color:var(--color-primary)]/20"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </nav>
        <div className="rounded-3xl border border-[color:var(--color-primary)]/30 bg-[linear-gradient(180deg,rgba(0,92,255,0.18),rgba(255,255,255,0.04))] p-5">
          {session ? (
            <>
              <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-primary-soft)]">
                Sesion activa
              </p>
              <p className="mt-3 text-sm text-white">{session.user.email}</p>
              <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">
                Acceso actual: {session.user.role === 'coach' ? 'coach' : 'athlete'}
              </p>
            </>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-primary-soft)]">
                Foco del mes
              </p>
              <p className="mt-3 text-sm text-[color:var(--color-text-muted)]">
                Inicia sesión para trabajar con el panel del atleta o del coach sobre el backend real.
              </p>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
