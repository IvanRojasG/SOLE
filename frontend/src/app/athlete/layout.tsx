import { requireSession } from '@/services/auth/session';

export const dynamic = 'force-dynamic';

export default async function AthleteRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSession('athlete', '/athlete');

  return children;
}
