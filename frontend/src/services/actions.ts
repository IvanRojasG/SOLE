'use server';

import { revalidatePath } from 'next/cache';
import { unstable_rethrow } from 'next/navigation';

import { dataSource } from '@/lib/config/dataSource';
import { backendRequest } from '@/services/api/backend';
import type {
  AthleteBaseline,
  BaselineCatalogItem,
  BaselineEntry,
  ChallengeManagementItem,
  ResultFormat,
} from '@/types';

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
    nextTarget: '/athlete/profile',
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
      const hasValue = isStatusEntry
        ? entry.status !== 'not_started'
        : entry.value !== null && entry.value > 0;

      if (!hasValue) {
        continue;
      }

      await backendRequest('/baseline/entries', {
        method: 'POST',
        role: 'athlete',
        nextTarget: '/athlete/baseline',
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
        nextTarget: '/athlete/baseline',
        body: payload,
      });
      continue;
    }

    await backendRequest('/baseline/prs', {
      method: 'POST',
      role: 'athlete',
      nextTarget: '/athlete/baseline',
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
        nextTarget: '/athlete/baseline',
        body: payload,
      });
      continue;
    }

    await backendRequest('/baseline/skills', {
      method: 'POST',
      role: 'athlete',
      nextTarget: '/athlete/baseline',
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
    nextTarget: '/athlete/baseline',
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
    nextTarget: '/coach/baseline',
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
  completed: boolean;
  resultFormat: ResultFormat;
  timeSeconds: number | null;
  repsCompleted: number | null;
  weightLbs: number | null;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (dataSource === 'mock') {
    return { ok: true };
  }

  try {
    await backendRequest('/achievements', {
      method: 'POST',
      role: 'athlete',
      nextTarget: '/athlete/achievements',
      body: {
        challenge_id: payload.challengeId,
        achievement_date: payload.achievementDate,
        completed: payload.completed,
        result_format: payload.resultFormat,
        time_seconds: payload.timeSeconds,
        reps_completed: payload.repsCompleted,
        weight_lbs: payload.weightLbs,
      },
    });
  } catch (caught) {
    unstable_rethrow(caught);

    if (
      caught instanceof Error &&
      caught.message.includes('Duplicate achievement is not allowed')
    ) {
      return {
        ok: false,
        error:
          'No se puede registrar este logro porque ya existe para ese WOD y esa fecha.',
      };
    }

    return {
      ok: false,
      error:
        caught instanceof Error
          ? caught.message
          : 'No se pudo registrar el logro.',
    };
  }

  revalidatePath('/athlete/achievements');
  revalidatePath('/athlete');
  return { ok: true };
}

export async function approveAchievementAction(
  achievementId: string,
  result?: {
    completed: boolean;
    resultFormat: ResultFormat;
    timeSeconds: number | null;
    repsCompleted: number | null;
    weightLbs: number | null;
  },
) {
  if (dataSource === 'mock') {
    return { ok: true };
  }

  await backendRequest(`/achievements/${achievementId}/approve`, {
    method: 'POST',
    role: 'coach',
    nextTarget: '/coach/achievements',
    body: result
      ? {
          completed: result.completed,
          result_format: result.resultFormat,
          time_seconds: result.timeSeconds,
          reps_completed: result.repsCompleted,
          weight_lbs: result.weightLbs,
        }
      : undefined,
  });

  revalidatePath('/coach/achievements');
  revalidatePath('/coach');
  revalidatePath('/leaderboard');
  revalidatePath('/athletes');
  return { ok: true };
}

export async function updateAchievementResultAction(
  achievementId: string,
  result: {
    completed: boolean;
    resultFormat: ResultFormat;
    timeSeconds: number | null;
    repsCompleted: number | null;
    weightLbs: number | null;
  },
) {
  if (dataSource === 'mock') {
    return { ok: true };
  }

  await backendRequest(`/achievements/${achievementId}/result`, {
    method: 'PUT',
    role: 'coach',
    nextTarget: '/coach/achievements',
    body: {
      completed: result.completed,
      result_format: result.resultFormat,
      time_seconds: result.timeSeconds,
      reps_completed: result.repsCompleted,
      weight_lbs: result.weightLbs,
    },
  });

  revalidatePath('/coach/achievements');
  revalidatePath('/coach');
  revalidatePath('/leaderboard');
  revalidatePath('/athletes');
  revalidatePath('/athlete/achievements');
  return { ok: true };
}

export async function rejectAchievementAction(achievementId: string) {
  if (dataSource === 'mock') {
    return { ok: true };
  }

  await backendRequest(`/achievements/${achievementId}/reject`, {
    method: 'POST',
    role: 'coach',
    nextTarget: '/coach/achievements',
  });

  revalidatePath('/coach/achievements');
  revalidatePath('/coach');
  return { ok: true };
}

export async function updateAchievementTieBreakAction(
  achievementId: string,
  tieBreakOrder: number,
) {
  if (dataSource === 'mock') {
    return { ok: true };
  }

  await backendRequest(`/achievements/${achievementId}/tie-break`, {
    method: 'PUT',
    role: 'coach',
    nextTarget: '/coach/achievements',
    body: {
      tie_break_order: tieBreakOrder,
    },
  });

  revalidatePath('/coach/achievements');
  revalidatePath('/coach');
  revalidatePath('/leaderboard');
  revalidatePath('/athletes');
  return { ok: true };
}

export async function updateChallengeAction(item: ChallengeManagementItem) {
  if (dataSource === 'mock') {
    return { ok: true };
  }

  await backendRequest(`/challenges/${item.id}`, {
    method: 'PUT',
    role: 'coach',
    nextTarget: '/coach/challenges',
    body: {
      title: item.title,
      category: item.category,
      summary: item.summary,
      start_date: item.startDate,
      end_date: item.endDate,
      youtube_url: item.youtubeUrl,
      total_reps: item.totalReps,
      is_active: item.isActive,
    },
  });

  revalidatePath('/coach/challenges');
  revalidatePath('/challenges');
  return { ok: true };
}

export async function createChallengeAction(payload: ChallengeManagementItem) {
  if (dataSource === 'mock') {
    return { ok: true, item: payload };
  }

  const created = await backendRequest<{
    id: string;
    title: string;
    category: ChallengeManagementItem['category'];
    summary: string;
    start_date: string;
    end_date: string;
    youtube_url: string;
    total_reps: number;
    is_active: boolean;
  }>('/challenges', {
    method: 'POST',
    role: 'coach',
    nextTarget: '/coach/challenges',
    body: {
      title: payload.title,
      category: payload.category,
      summary: payload.summary,
      start_date: payload.startDate,
      end_date: payload.endDate,
      youtube_url: payload.youtubeUrl,
      total_reps: payload.totalReps,
      is_active: payload.isActive,
    },
  });

  revalidatePath('/coach/challenges');
  revalidatePath('/challenges');
  return {
    ok: true,
    item: {
      id: created.id,
      title: created.title,
      category: created.category,
      summary: created.summary,
      startDate: created.start_date,
      endDate: created.end_date,
      youtubeUrl: created.youtube_url,
      totalReps: created.total_reps,
      isActive: created.is_active,
    },
  };
}
