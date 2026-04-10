'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AttendanceCheckInTable } from '@/components/coach/AttendanceCheckInTable';
import { SessionCreationForm } from '@/components/coach/SessionCreationForm';
import { checkInAthleteAction, createAttendanceSessionAction } from '@/services/actions';
import type { Athlete, AttendanceSessionRecord } from '@/types';

type CoachAttendanceViewProps = {
  athletes: Athlete[];
  sessions: AttendanceSessionRecord[];
};

export function CoachAttendanceView({ athletes, sessions }: CoachAttendanceViewProps) {
  const [sessionState, setSessionState] = useState(sessions);
  const router = useRouter();

  return (
    <div className="space-y-6">
      <SessionCreationForm
        onCreate={async (session) => {
          await createAttendanceSessionAction({ sessionDate: session.sessionDate });
          setSessionState((current) => [session, ...current]);
          router.refresh();
        }}
      />
      <AttendanceCheckInTable
        athletes={athletes}
        sessions={sessionState}
        onCheckIn={async ({ sessionId, athleteId }) => {
          await checkInAthleteAction({ sessionId, athleteId });
          router.refresh();
        }}
      />
    </div>
  );
}
