import { AppContainer } from '@/components/layout/AppContainer';

export function EventHighlightStrip() {
  const items = [
    'Baseline único por atleta',
    'Validación exclusiva por coaches',
    'Puntos trazables en ledger',
    'Ranking claro y competitivo',
  ];

  return (
    <div className="border-y border-white/10 bg-white/5 py-5 md:py-6">
      <AppContainer className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-full border border-white/10 bg-[color:var(--color-surface)]/70 px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-muted)]"
          >
            {item}
          </div>
        ))}
      </AppContainer>
    </div>
  );
}
