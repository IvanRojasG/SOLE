type StreakCardProps = {
  streakDays: number;
};

export function StreakCard({ streakDays }: StreakCardProps) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(31,182,170,0.18),rgba(255,255,255,0.04))] p-6">
      <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-secondary-soft)]">
        Streak
      </p>
      <p className="mt-4 font-display text-7xl uppercase tracking-[0.08em] text-white">
        {streakDays}
      </p>
      <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
        días consecutivos con impulso
      </p>
    </article>
  );
}
