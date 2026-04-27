'use server';

import { revalidatePath } from 'next/cache';

import { dataSource } from '@/lib/config/dataSource';
import { backendRequest } from '@/services/api/backend';
import type { AthleteBaseline, BaselineCatalogItem, BaselineEntry, ChallengeManagementItem } from '@/types';

export async function saveAthleteProfileAction(payload: {
  fullName: string;
  level: string;
}) {
  if (dataSource === 'mock') {
    return { ok: true };
  }

  await backendRequest('/athletes/me', {
    method: 'PUT',
    role: 'athlete',
    body: {
      full_name: payload.fullName,
      level: payload.level,
    },
  });

  revalidatePath('/athlete/profile');
  revalidatePath('/athlete');
  return { ok: true };
}

export async function saveBaselineAction(baseline: AthleteBaseline) {
  if (dataSource === 'mock') {
    return { ok: true };
  }

  if (baseline.entries.length > 0) {
    for (const entry of baseline.entries) {
      const isStatusEntry = entry.metricType === 'status';
      const hasValue = isStatusEntry ? entry.status !== 'not_started' : entry.value !== null && entry.value > 0;

      if (!hasValue) {
        continue;
      }

      await backendRequest('/baseline/entries', {
        method: 'POST',
        role: 'athlete',
        body: {
          item_id: entry.itemId,
          value_number: isStatusEntry ? null : entry.value,
          status: isStatusEntry ? entry.status : null,
          notes: entry.notes,
        },
      });
    }

    revalidatePath('/athlete/baseline');
    revalidatePath('/athlete');
    return { ok: true };
  }

  for (const pr of baseline.prs) {
    const payload = {
      movement_id: pr.movementId,
      weight: pr.value,
    };

    if (pr.id) {
      await backendRequest(`/baseline/prs/${pr.id}`, {
        method: 'PUT',
        role: 'athlete',
        body: payload,
      });
      continue;
    }

    await backendRequest('/baseline/prs', {
      method: 'POST',
      role: 'athlete',
      body: payload,
    });
  }

  for (const skill of baseline.skills) {
    const payload = {
      skill_id: skill.skillId,
      status: skill.status,
    };

    if (skill.id) {
      await backendRequest(`/baseline/skills/${skill.id}`, {
        method: 'PUT',
        role: 'athlete',
        body: payload,
      });
      continue;
    }

    await backendRequest('/baseline/skills', {
      method: 'POST',
      role: 'athlete',
      body: payload,
    });
  }

  revalidatePath('/athlete/baseline');
  return { ok: true };
}

export async function lockBaselineAction() {
  if (dataSource === 'mock') {
    return { ok: true };
  }

  await backendRequest('/baseline/lock/me', {
    method: 'POST',
    role: 'athlete',
  });

  revalidatePath('/athlete/baseline');
  return { ok: true };
}

export async function createBaselineCatalogItemAction(payload: {
  name: string;
  category: BaselineEntry['category'];
  metricType: BaselineEntry['metricType'];
  unit: BaselineEntry['unit'];
  description: string;
}): Promise<{ ok: true; item: BaselineCatalogItem }> {
  if (dataSource === 'mock') {
    return {
      ok: true,
      item: {
        id: `local-${Date.now()}`,
        name: payload.name,
        category: payload.category,
        metricType: payload.metricType,
        unit: payload.unit,
        description: payload.description,
        isActive: true,
      },
    };
  }

  const item = await backendRequest<{
    id: string;
    name: string;
    category: BaselineEntry['category'];
    metric_type: BaselineEntry['metricType'];
    unit: BaselineEntry['unit'];
    description: string;
    is_active: boolean;
  }>('/baseline/catalog', {
    method: 'POST',
    role: 'coach',
    body: {
      name: payload.name,
      category: payload.category,
      metric_type: payload.metricType,
      unit: payload.unit,
      description: payload.description,
      is_active: true,
    },
  });

  revalidatePath('/coach/baseline');
  revalidatePath('/athlete/baseline');

  return {
    ok: true,
    item: {
      id: item.id,
      name: item.name,
      category: item.category,
      metricType: item.metric_type,
      unit: item.unit,
      description: item.description,
      isActive: item.is_active,
    },
  };
}

export async function submitAchievementAction(payload: {
  challengeId: string;
  achievementDate: string;
}) {
  if (dataSource === 'mock') {
    return { ok: true };
  }

  await backendRequest('/achievements', {
    method: 'POST',
    role: 'athlete',
    body: {
      challenge_id: payload.challengeId,
      achievement_date: payload.achievementDate,
    },
  });

  revalidatePath('/athlete/achievements');
  revalidatePath('/athlete');
  return { ok: true };
}

export async function createAttendanceSessionAction(payload: { sessionDate: string }) {
  if (dataSource === 'mock') {
    return { ok: true };
  }

  await backendRequest('/attendance/session', {
    method: 'POST',
    role: 'coach',
    body: {
      session_date: payload.sessionDate,
    },
  });

  revalidatePath('/coach/attendance');
  revalidatePath('/coach');
  return { ok: true };
}

export async function checkInAthleteAction(payload: { sessionId: string; athleteId: string }) {
  if (dataSource === 'mock') {
    return { ok: true };
  }

  await backendRequest(`/attendance/session/${payload.sessionId}/checkin`, {
    method: 'POST',
    role: 'coach',
    body: {
      athlete_id: payload.athleteId,
    },
  });

  revalidatePath('/coach/attendance');
  return { ok: true };
}

export async function approveAchievementAction(achievementId: string) {
  if (dataSource === 'mock') {
    return { ok: true };
  }

  await backendRequest(`/achievements/${achievementId}/approve`, {
    method: 'POST',
    role: 'coach',
  });

  revalidatePath('/coach/achievements');
  revalidatePath('/coach');
  revalidatePath('/leaderboard');
  revalidatePath('/athletes');
  return { ok: true };
}

export async function rejectAchievementAction(achievementId: string) {
  if (dataSource === 'mock') {
    return { ok: true };
  }

  await backendRequest(`/achievements/${achievementId}/reject`, {
    method: 'POST',
    role: 'coach',
  });

  revalidatePath('/coach/achievements');
  revalidatePath('/coach');
  return { ok: true };
}

export async function updateChallengeAction(item: ChallengeManagementItem) {
  if (dataSource === 'mock') {
    return { ok: true };
  }

  await backendRequest(`/challenges/${item.id}`, {
    method: 'PUT',
    role: 'coach',
    body: {
      title: item.title,
      category: item.category,
      difficulty: item.difficulty,
      summary: item.summary,
      window_label: item.windowLabel,
      is_active: item.isActive,
      points: item.points,
    },
  });

  revalidatePath('/coach/challenges');
  revalidatePath('/challenges');
  return { ok: true };
}

export async function createChallengeAction(payload: ChallengeManagementItem) {
  if (dataSource === 'mock') {
    return { ok: true };
  }

  await backendRequest('/challenges', {
    method: 'POST',
    role: 'coach',
    body: {
      title: payload.title,
      category: payload.category,
      difficulty: payload.difficulty,
      summary: payload.summary,
      window_label: payload.windowLabel,
      is_active: payload.isActive,
      points: payload.points,
    },
  });

  revalidatePath('/coach/challenges');
  revalidatePath('/challenges');
  return { ok: true };
}
