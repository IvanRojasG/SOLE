'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AchievementList } from '@/components/athlete/AchievementList';
import { AchievementSubmissionForm } from '@/components/athlete/AchievementSubmissionForm';
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
  const router = useRouter();

  return (
    <div className="space-y-6">
      <AchievementSubmissionForm
        challenges={challenges}
        onSubmit={async (achievement) => {
          await submitAchievementAction({
            challengeId: achievement.challengeId,
            achievementDate: achievement.achievementDate,
          });
          setAchievementState((current) =>
            [achievement, ...current].sort((left, right) =>
              right.achievementDate.localeCompare(left.achievementDate),
            ),
          );
          router.refresh();
        }}
      />
      <AchievementList achievements={achievementState} />
    </div>
  );
}
