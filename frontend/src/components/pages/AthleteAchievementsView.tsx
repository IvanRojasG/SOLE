'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AchievementList } from '@/components/athlete/AchievementList';
import { AchievementSubmissionForm } from '@/components/athlete/AchievementSubmissionForm';
import { ActionToast } from '@/components/shared/ActionToast';
import { submitAchievementAction } from '@/services/actions';
import type { Achievement, Challenge } from '@/types';

type AthleteAchievementsViewProps = {
  achievements: Achievement[];
  challenges: Challenge[];
};

export function AthleteAchievementsView({
  achievements,
  challenges,
}: AthleteAchievementsViewProps) {
  const [achievementState, setAchievementState] = useState(achievements);
  const [toast, setToast] = useState<{
    message: string;
    tone: 'success' | 'error';
  } | null>(null);
  const router = useRouter();

  return (
    <div className="space-y-6">
      {toast ? (
        <ActionToast
          message={toast.message}
          tone={toast.tone}
          onDismiss={() => setToast(null)}
        />
      ) : null}
      <AchievementSubmissionForm
        challenges={challenges}
        onSubmit={async (achievement) => {
          const result = await submitAchievementAction({
            challengeId: achievement.challengeId,
            achievementDate: achievement.achievementDate,
            completed: achievement.completed,
            resultFormat: achievement.resultFormat,
            timeSeconds: achievement.timeSeconds,
            repsCompleted: achievement.repsCompleted,
            weightLbs: achievement.weightLbs ?? null,
          });

          if (!result.ok) {
            setToast({
              message: result.error,
              tone: 'error',
            });
            throw new Error(result.error);
          }

          setAchievementState((current) =>
            [achievement, ...current].sort((left, right) =>
              right.achievementDate.localeCompare(left.achievementDate),
            ),
          );
          setToast({
            message:
              'Logro registrado correctamente. Queda pendiente de aprobación del coach.',
            tone: 'success',
          });
          router.refresh();
        }}
      />
      <AchievementList achievements={achievementState} />
    </div>
  );
}
