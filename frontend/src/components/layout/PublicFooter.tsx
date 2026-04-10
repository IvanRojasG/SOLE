import Link from 'next/link';

import { brand } from '@/lib/config/brand';

import { AppContainer } from './AppContainer';

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-[color:var(--color-surface)]">
      <AppContainer className="grid gap-10 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-4xl uppercase tracking-[0.16em] text-white">
            {brand.name}
          </p>
          <p className="mt-4 max-w-md text-sm leading-7 text-[color:var(--color-text-muted)]">
            Plataforma visual base para retos deportivos, progreso medible y comunicación clara
            entre box, coaches y atletas.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-primary-soft)]">
            Navegación
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {brand.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-[color:var(--color-text-muted)] transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-primary-soft)]">
            Estado
          </p>
          <p className="mt-4 text-sm leading-7 text-[color:var(--color-text-muted)]">
            Fase actual: branding, layout, navegación y home pública listas. Sin conexión a datos ni
            lógica de negocio todavía.
          </p>
        </div>
      </AppContainer>
    </footer>
  );
}
