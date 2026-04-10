'use client';

type LockBaselineButtonProps = {
  locked: boolean;
  onLock: () => void;
};

export function LockBaselineButton({ locked, onLock }: LockBaselineButtonProps) {
  return (
    <button
      type="button"
      disabled={locked}
      onClick={onLock}
      className="rounded-full bg-[color:var(--color-primary)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--color-ink)] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-[color:var(--color-text-muted)]"
    >
      {locked ? 'Baseline bloqueado' : 'Bloquear baseline'}
    </button>
  );
}
