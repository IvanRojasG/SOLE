import { NextResponse } from 'next/server';

import { clearSession, safeNextTarget } from '@/services/auth/session';

export async function GET(request: Request) {
  await clearSession();

  const requestUrl = new URL(request.url);
  const nextTarget = safeNextTarget(requestUrl.searchParams.get('next') ?? undefined);
  const redirectPath = nextTarget
    ? `/login?expired=1&next=${encodeURIComponent(nextTarget)}`
    : '/login?expired=1';
  const publicOrigin = requestUrl.origin.replace('://0.0.0.0', '://localhost');

  return NextResponse.redirect(new URL(redirectPath, publicOrigin));
}
