'use client';

import { useState, useTransition } from 'react';

import type { Achievement, Challenge } from '@/types';

type AchievementSubmissionFormProps = {
  challenges: Challenge[];
  onSubmit: (achievement: Achievement) => Promise<void>;
};

export function AchievementSubmissionForm({
  challenges,
  onSubmit,
}: AchievementSubmissionFormProps) {
  const [challengeId, setChallengeId] = useState(challenges[0]?.id ?? '');
  const [achievementDate, setAchievementDate] = useState('2026-04-29');
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
      onSubmit={(event) => {
        event.preventDefault();
        const selectedChallenge = challenges.find((item) => item.id === challengeId);

        if (!selectedChallenge) {
          return;
        }

        startTransition(async () => {
          await onSubmit({
            id: `draft-${Date.now()}`,
            athleteId: 'ath-03',
            challengeId: selectedChallenge.id,
            title: selectedChallenge.title,
            status: 'submitted',
            achievementDate,
            pointsAwarded: 0,
          });
        });
      }}
    >
      <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-primary-soft)]">
        Submission form
      </p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
            Reto
          </span>
          <select
            value={challengeId}
            onChange={(event) => setChallengeId(event.target.value)}
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
          <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
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
      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm text-[color:var(--color-text-muted)]">
          En esta fase el envío es visual y se agrega al listado local.
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-[color:var(--color-primary)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--color-ink)]"
        >
          {isPending ? 'Enviando...' : 'Registrar logro'}
        </button>
      </div>
    </form>
  );
}
