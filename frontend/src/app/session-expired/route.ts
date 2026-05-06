import { NextResponse } from 'next/server';

import { clearSession, safeNextTarget } from '@/services/auth/session';

export async function GET(request: Request) {
  await clearSession();

  const requestUrl = new URL(request.url);
  const redirectUrl = new URL('/login', requestUrl.origin);
  const nextTarget = safeNextTarget(requestUrl.searchParams.get('next') ?? undefined);

  redirectUrl.searchParams.set('expired', '1');

  if (nextTarget) {
    redirectUrl.searchParams.set('next', nextTarget);
  }

  return NextResponse.redirect(redirectUrl);
}
