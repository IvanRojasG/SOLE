import type { Challenge } from '@/types';

type ActiveChallengesPanelProps = {
  challenges: Challenge[];
};

export function ActiveChallengesPanel({ challenges }: ActiveChallengesPanelProps) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-primary-soft)]">
            Retos activos
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Tu frente inmediato</h3>
        </div>
        <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white">
          {challenges.length} activos
        </div>
      </div>
      {challenges.length === 0 ? (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/15 p-5 text-sm text-[color:var(--color-text-muted)]">
          No hay retos activos por mostrar todavía.
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="rounded-[1.5rem] border border-white/10 bg-[color:var(--color-surface)] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                    {challenge.category}
                  </p>
                  <h4 className="mt-2 text-lg font-semibold text-white">{challenge.title}</h4>
                </div>
                <div className="rounded-full bg-[color:var(--color-primary)] px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--color-ink)]">
                  {challenge.points} pts
                </div>
              </div>
              <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-muted)]">
                {challenge.summary}
              </p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
