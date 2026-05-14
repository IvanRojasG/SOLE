'use client';

import { useState } from 'react';

import type { Achievement, Challenge, ResultFormat } from '@/types';

type AchievementSubmissionFormProps = {
  challenges: Challenge[];
  onSubmit: (achievement: Achievement) => Promise<void>;
};

function getTodayValue() {
  return new Date().toISOString().slice(0, 10);
}

export function AchievementSubmissionForm({
  challenges,
  onSubmit,
}: AchievementSubmissionFormProps) {
  const [challengeId, setChallengeId] = useState(challenges[0]?.id ?? '');
  const [achievementDate, setAchievementDate] = useState(getTodayValue);
  const [resultFormat, setResultFormat] = useState<ResultFormat>('scaled');
  const [completed, setCompleted] = useState(true);
  const [timeMinutes, setTimeMinutes] = useState(0);
  const [timeSecondsInput, setTimeSecondsInput] = useState(0);
  const [repsCompleted, setRepsCompleted] = useState(0);
  const [weightLbs, setWeightLbs] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const selectedChallenge = challenges.find((item) => item.id === challengeId);
  const isAmrapReps = selectedChallenge?.scoringType === 'amrap_reps';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedChallenge || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      const isPowerLifting = selectedChallenge.category === 'power_lifting';
      const finalCompleted = isPowerLifting ? false : isAmrapReps ? true : completed;
      const finalRepsCompleted = finalCompleted && !isAmrapReps
        ? selectedChallenge.totalReps
        : repsCompleted;
      const finalTimeSeconds = timeMinutes * 60 + timeSecondsInput;
      if (finalCompleted && !isAmrapReps && finalTimeSeconds <= 0) {
        setFormError('Indica un tiempo mayor a 0 segundos.');
        return;
      }
      if ((isAmrapReps || !finalCompleted) && finalRepsCompleted < 0) {
        setFormError('Indica una cantidad de repeticiones válida.');
        return;
      }

      setFormError('');
      await onSubmit({
        id: `draft-${Date.now()}`,
        athleteId: 'ath-03',
        challengeId: selectedChallenge.id,
        title: selectedChallenge.title,
        status: 'submitted',
        achievementDate,
        pointsAwarded: 0,
        completed: finalCompleted,
        resultFormat,
        timeSeconds: finalCompleted && !isAmrapReps ? finalTimeSeconds : null,
        repsCompleted: finalRepsCompleted,
        weightLbs: isPowerLifting ? weightLbs : null,
        tieBreakOrder: null,
        rankPoints: null,
      });
      setAchievementDate(getTodayValue());
      setResultFormat('scaled');
      setCompleted(true);
      setTimeMinutes(0);
      setTimeSecondsInput(0);
      setRepsCompleted(0);
      setWeightLbs(0);
      setFormError('');
    } catch {
      // The parent view owns the user-facing error message.
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
      onSubmit={handleSubmit}
    >
      <p className="text-xs tracking-[0.22em] text-[color:var(--color-primary-soft)] uppercase">
        Submission form
      </p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-xs tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
            Reto
          </span>
          <select
            value={challengeId}
            onChange={(event) => {
              setChallengeId(event.target.value);
              setCompleted(true);
              setTimeMinutes(0);
              setTimeSecondsInput(0);
              setRepsCompleted(0);
              setWeightLbs(0);
              setFormError('');
            }}
            className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
          >
            {challenges.map((challenge) => (
              <option key={challenge.id} value={challenge.id}>
                {challenge.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
            Fecha
          </span>
          <input
            type="date"
            value={achievementDate}
            onChange={(event) => setAchievementDate(event.target.value)}
            className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
          />
        </label>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-xs tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
            Formato
          </span>
          <select
            value={resultFormat}
            onChange={(event) =>
              setResultFormat(event.target.value as ResultFormat)
            }
            className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
          >
            <option value="scaled">Scaled</option>
            <option value="rx">RX</option>
          </select>
        </label>
        {selectedChallenge?.category === 'custom_metcon_reps' && !isAmrapReps ? (
          <label className="block">
            <span className="text-xs tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
              Estado
            </span>
            <select
              value={completed ? 'completed' : 'partial'}
              onChange={(event) => setCompleted(event.target.value === 'completed')}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
            >
              <option value="completed">Completado</option>
              <option value="partial">No completado</option>
            </select>
          </label>
        ) : null}
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {selectedChallenge?.category === 'custom_metcon_reps' && completed && !isAmrapReps ? (
          <div className="block">
            <span className="text-xs tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
              Tiempo total
            </span>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-[11px] tracking-[0.16em] text-[color:var(--color-text-muted)] uppercase">
                  Minutos
                </span>
                <input
                  type="number"
                  min={0}
                  value={timeMinutes || ''}
                  onChange={(event) => setTimeMinutes(Number(event.target.value))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
                />
              </label>
              <label className="block">
                <span className="text-[11px] tracking-[0.16em] text-[color:var(--color-text-muted)] uppercase">
                  Segundos
                </span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={timeSecondsInput || ''}
                  onChange={(event) => setTimeSecondsInput(Number(event.target.value))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
                />
              </label>
            </div>
            <span className="mt-2 block text-xs text-[color:var(--color-text-muted)]">
              Se registrarán {selectedChallenge.totalReps} reps al completarlo.
            </span>
          </div>
        ) : (
        <label className="block">
          <span className="text-xs tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
            Repeticiones
          </span>
          <input
            type="number"
            min={0}
            value={repsCompleted || ''}
            onChange={(event) => setRepsCompleted(Number(event.target.value))}
            className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
          />
        </label>
        )}
        {selectedChallenge?.category === 'power_lifting' ? (
          <label className="block">
            <span className="text-xs tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
              Peso (lb)
            </span>
            <input
              type="number"
              min={1}
              value={weightLbs || ''}
              onChange={(event) => setWeightLbs(Number(event.target.value))}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
            />
          </label>
        ) : null}
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[color:var(--color-text-muted)]">
            El coach validará el resultado antes de que impacte el leaderboard.
          </p>
          {formError ? (
            <p className="mt-2 text-sm font-semibold text-[color:var(--color-danger)]">
              {formError}
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-[color:var(--color-primary)] px-5 py-3 text-xs font-bold tracking-[0.18em] text-[color:var(--color-ink)] uppercase disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Enviando...' : 'Registrar logro'}
        </button>
      </div>
    </form>
  );
}
