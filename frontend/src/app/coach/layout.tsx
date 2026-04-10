import { requireSession } from '@/services/auth/session';

export const dynamic = 'force-dynamic';

export default async function CoachRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSession('coach', '/coach');

  return children;
}
