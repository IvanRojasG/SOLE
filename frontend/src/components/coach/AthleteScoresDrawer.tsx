'use client';

import type { Athlete, AthleteScoreAttempt, AthleteScoresDetail } from '@/types';

type AthleteScoresDrawerProps = {
  athlete: Athlete | null;
  scores: AthleteScoresDetail | null;
  loading: boolean;
  error: string | null;
  open: boolean;
  onClose: () => void;
};

function formatTime(seconds: number | null): string {
  if (seconds == null) {
    return 'Sin tiempo';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-CR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
}

function formatAttemptScore(attempt: AthleteScoreAttempt): string {
  if (attempt.weightLbs != null) {
    const reps = attempt.repsCompleted != null ? `${attempt.repsCompleted} reps · ` : '';
    return `${reps}${attempt.weightLbs} lb`;
  }

  if (attempt.completed) {
    return formatTime(attempt.timeSeconds);
  }

  if (attempt.repsCompleted != null) {
    return `${attempt.repsCompleted} reps`;
  }

  return 'Sin score';
}

function getStatusLabel(status: AthleteScoreAttempt['status']): string {
  if (status === 'approved') {
    return 'Aprobado';
  }
  if (status === 'rejected') {
    return 'Rechazado';
  }
  return 'Pendiente';
}

function getStatusClass(status: AthleteScoreAttempt['status']): string {
  if (status === 'approved') {
    return 'bg-emerald-100 text-emerald-800';
  }
  if (status === 'rejected') {
    return 'bg-rose-100 text-rose-800';
  }
  return 'bg-amber-100 text-amber-800';
}

export function AthleteScoresDrawer({
  athlete,
  scores,
  loading,
  error,
  open,
  onClose,
}: AthleteScoresDrawerProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[94vw] max-w-3xl overflow-y-auto border-l border-white/10 bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-lift)] transition-transform sm:p-6 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[color:var(--color-primary-soft)] uppercase">
              Scores del atleta
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {scores?.athleteName ?? athlete?.fullName ?? 'Atleta'}
            </h2>
            <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
              Revisión de intentos registrados y resultado tomado para leaderboard.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-950 bg-slate-950 px-4 py-2 text-xs font-bold text-white uppercase shadow-[0_12px_28px_rgba(15,23,42,0.22)] transition hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)] hover:text-[color:var(--color-ink)] focus-visible:shadow-[0_0_0_3px_rgba(0,92,255,0.28)]"
          >
            Cerrar
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-[color:var(--color-text-muted)]">
              Cargando scores...
            </div>
          ) : null}

          {!loading && error ? (
            <div className="rounded-2xl border border-rose-300/40 bg-rose-950/30 p-5 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          {!loading && !error && scores?.scores.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-5 text-sm text-[color:var(--color-text-muted)]">
              Este atleta todavía no tiene scores registrados.
            </div>
          ) : null}

          {!loading && !error
            ? scores?.scores.map((score) => (
                <section
                  key={score.challengeId}
                  className="athlete-score-wod-card rounded-2xl border p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {score.challengeTitle}
                      </h3>
                      <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
                        Cierre {formatDate(score.challengeEndDate)} ·{' '}
                        {score.isFinalized ? 'Finalizado' : 'En progreso'}
                      </p>
                    </div>
                    <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white uppercase">
                      {score.attempts.length} intentos
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {score.attempts.map((attempt) => (
                      <article
                        key={attempt.id}
                        className={`rounded-xl border p-4 ${
                          attempt.countsForLeaderboard
                            ? 'athlete-score-winning-attempt border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/10'
                            : 'border-slate-200 bg-white/80 shadow-[0_10px_26px_rgba(15,23,42,0.05)]'
                        }`}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-base font-semibold text-white">
                              {formatAttemptScore(attempt)}
                            </p>
                            <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
                              {formatDate(attempt.achievementDate)} ·{' '}
                              {attempt.resultFormat.toUpperCase()}
                              {attempt.tieBreakOrder
                                ? ` · Tie-break ${attempt.tieBreakOrder}`
                                : ''}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${getStatusClass(
                                attempt.status,
                              )}`}
                            >
                              {getStatusLabel(attempt.status)}
                            </span>
                            {attempt.countsForLeaderboard ? (
                              <span className="athlete-score-leaderboard-badge rounded-full bg-[color:var(--color-primary)] px-3 py-1 text-xs font-bold text-white uppercase">
                                Cuenta para leaderboard
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="mt-3 grid gap-2 text-xs text-[color:var(--color-text-muted)] sm:grid-cols-3">
                          <span>Puntos: {attempt.rankPoints ?? 0}</span>
                          <span>Reps: {attempt.repsCompleted ?? '-'}</span>
                          <span>Tiempo: {formatTime(attempt.timeSeconds)}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))
            : null}
        </div>
      </aside>
    </>
  );
}
