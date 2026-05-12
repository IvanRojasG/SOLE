import type { Metadata } from 'next';

import { PublicFooter } from '@/components/layout/PublicFooter';
import { PublicTopNav } from '@/components/layout/PublicTopNav';
import { brand } from '@/lib/config/brand';
import { theme } from '@/lib/config/theme';
import { getSession } from '@/services/auth/session';

import './globals.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `${brand.name} | Home`,
  description: brand.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="es">
      <body
        className="antialiased"
        style={
          {
            '--font-display': theme.typography.display,
            '--font-body': theme.typography.body,
            '--color-ink': theme.colors.ink,
            '--color-surface': theme.colors.surface,
            '--color-surface-elevated': theme.colors.surfaceElevated,
            '--color-card': theme.colors.card,
            '--color-line': theme.colors.line,
            '--color-text': theme.colors.text,
            '--color-text-muted': theme.colors.textMuted,
            '--color-primary': theme.colors.primary,
            '--color-primary-soft': theme.colors.primarySoft,
            '--color-secondary': theme.colors.secondary,
            '--color-secondary-soft': theme.colors.secondarySoft,
            '--color-accent': theme.colors.accent,
            '--shadow-soft': theme.shadows.soft,
            '--shadow-glow': theme.shadows.glow,
            '--shadow-lift': theme.shadows.lift,
            '--layout-container': theme.spacing.container,
            '--section-spacing': theme.spacing.sectionY,
            '--nav-height': theme.spacing.nav,
          } as React.CSSProperties
        }
      >
        <div className="sole-page-grid relative min-h-screen bg-[color:var(--color-ink)] text-[color:var(--color-text)]">
          <a href="#main-content" className="skip-link">
            Saltar al contenido
          </a>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,92,255,0.22),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(20,184,166,0.18),transparent_22%),linear-gradient(180deg,#061326_0%,#0a1f44_52%,#123a7d_100%)]" />
          <div className="relative z-10 flex min-h-screen flex-col">
            <PublicTopNav session={session} />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <PublicFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
