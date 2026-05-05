import type { Challenge } from '@/types';

type ChallengeCardProps = {
  challenge: Challenge;
};

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  return (
    <article className="rounded-[1.9rem] border border-white/10 bg-white/5 p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-primary-soft)]">
            {challenge.category}
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">{challenge.title}</h2>
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-[color:var(--color-text-muted)]">{challenge.summary}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-white">
          {challenge.category === 'power_lifting' ? 'Power Lifting' : 'Custom Metcon (Reps)'}
        </span>
        <span className="rounded-full border border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
          {challenge.startDate} · {challenge.endDate}
        </span>
      </div>
    </article>
  );
}
