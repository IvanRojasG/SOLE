'use client';

import { useEffect, useMemo, useState } from 'react';

import type { Athlete, Challenge, ResultFormat } from '@/types';

type CoachWodRegistrationDrawerProps = {
  athlete: Athlete | null;
  challenges: Challenge[];
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    athleteId: string;
    challengeId: string;
    achievementDate: string;
    completed: boolean;
    resultFormat: ResultFormat;
    timeSeconds: number | null;
    repsCompleted: number | null;
    weightLbs: number | null;
  }) => Promise<{ ok: true } | { ok: false; error: string }>;
};

function getTodayValue() {
  return new Date().toISOString().slice(0, 10);
}

export function CoachWodRegistrationDrawer({
  athlete,
  challenges,
  open,
  onClose,
  onSubmit,
}: CoachWodRegistrationDrawerProps) {
  const availableChallenges = useMemo(
    () => challenges.filter((challenge) => challenge.isActive),
    [challenges],
  );
  const [challengeId, setChallengeId] = useState(availableChallenges[0]?.id ?? '');
  const [achievementDate, setAchievementDate] = useState(getTodayValue);
  const [resultFormat, setResultFormat] = useState<ResultFormat>('scaled');
  const [completed, setCompleted] = useState(true);
  const [timeMinutes, setTimeMinutes] = useState(0);
  const [timeSecondsInput, setTimeSecondsInput] = useState(0);
  const [repsCompleted, setRepsCompleted] = useState(0);
  const [weightLbs, setWeightLbs] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const selectedChallenge = availableChallenges.find((item) => item.id === challengeId);

  useEffect(() => {
    if (!challengeId && availableChallenges[0]) {
      setChallengeId(availableChallenges[0].id);
    }
  }, [availableChallenges, challengeId]);

  function resetResultFields() {
    setCompleted(true);
    setTimeMinutes(0);
    setTimeSecondsInput(0);
    setRepsCompleted(0);
    setWeightLbs(0);
    setFormError('');
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!athlete || !selectedChallenge || isSubmitting) {
      return;
    }

    const isPowerLifting = selectedChallenge.category === 'power_lifting';
    const finalCompleted = isPowerLifting ? false : completed;
    const finalRepsCompleted = finalCompleted
      ? selectedChallenge.totalReps
      : repsCompleted;
    const finalTimeSeconds = timeMinutes * 60 + timeSecondsInput;

    if (finalCompleted && finalTimeSeconds <= 0) {
      setFormError('Indica un tiempo mayor a 0 segundos.');
      return;
    }
    if (!finalCompleted && finalRepsCompleted < 0) {
      setFormError('Indica una cantidad de repeticiones válida.');
      return;
    }
    if (isPowerLifting && weightLbs <= 0) {
      setFormError('Indica el peso validado para Power Lifting.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    const result = await onSubmit({
      athleteId: athlete.id,
      challengeId: selectedChallenge.id,
      achievementDate,
      completed: finalCompleted,
      resultFormat,
      timeSeconds: finalCompleted ? finalTimeSeconds : null,
      repsCompleted: finalRepsCompleted,
      weightLbs: isPowerLifting ? weightLbs : null,
    });
    setIsSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    setAchievementDate(getTodayValue());
    setResultFormat('scaled');
    resetResultFields();
    onClose();
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 z-50 flex h-dvh w-[92vw] max-w-xl flex-col overflow-hidden border-l border-slate-200 bg-white shadow-[var(--shadow-lift)] transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="sole-hatch flex items-start justify-between gap-4 border-b border-slate-200 p-6">
          <div>
            <p className="text-xs tracking-[0.22em] text-[color:var(--color-primary)] uppercase">
              Registro validado
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              {athlete?.fullName ?? 'Seleccionar atleta'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 bg-slate-950 px-3 py-2 text-xs font-bold tracking-[0.18em] text-white uppercase shadow-[0_12px_28px_rgba(15,23,42,0.18)] transition hover:bg-[color:var(--color-primary)]"
          >
            Cerrar
          </button>
        </div>
        <form className="flex flex-1 flex-col overflow-hidden" onSubmit={handleSubmit}>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {availableChallenges.length === 0 ? (
              <div className="rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                No hay WODs activos disponibles para registro.
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
                      WOD
                    </span>
                    <select
                      value={challengeId}
                      onChange={(event) => {
                        setChallengeId(event.target.value);
                        resetResultFields();
                      }}
                      className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[color:var(--color-primary)]"
                    >
                      {availableChallenges.map((challenge) => (
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
                      className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[color:var(--color-primary)]"
                    />
                  </label>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
                      Formato
                    </span>
                    <select
                      value={resultFormat}
                      onChange={(event) =>
                        setResultFormat(event.target.value as ResultFormat)
                      }
                      className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[color:var(--color-primary)]"
                    >
                      <option value="scaled">Scaled</option>
                      <option value="rx">RX</option>
                    </select>
                  </label>
                  {selectedChallenge?.category === 'custom_metcon_reps' ? (
                    <label className="block">
                      <span className="text-xs tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
                        Estado
                      </span>
                      <select
                        value={completed ? 'completed' : 'partial'}
                        onChange={(event) => setCompleted(event.target.value === 'completed')}
                        className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[color:var(--color-primary)]"
                      >
                        <option value="completed">Completado</option>
                        <option value="partial">No completado</option>
                      </select>
                    </label>
                  ) : null}
                </div>
                {selectedChallenge?.category === 'custom_metcon_reps' && completed ? (
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
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[color:var(--color-primary)]"
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
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[color:var(--color-primary)]"
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
                      className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[color:var(--color-primary)]"
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
                      className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-[color:var(--color-primary)]"
                    />
                  </label>
                ) : null}
                {formError ? (
                  <p className="text-sm font-semibold text-[color:var(--color-danger)]">
                    {formError}
                  </p>
                ) : null}
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 p-6">
            <p className="text-sm text-[color:var(--color-text-muted)]">
              El resultado quedará aprobado al guardarlo.
            </p>
            <button
              type="submit"
              disabled={isSubmitting || availableChallenges.length === 0}
              className="rounded-full bg-slate-950 px-5 py-3 text-xs font-bold tracking-[0.18em] text-white uppercase transition hover:bg-[color:var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Guardando...' : 'Registrar WOD'}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
