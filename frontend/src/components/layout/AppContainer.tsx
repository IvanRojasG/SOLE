import { cn } from '@/lib/utils/cn';

type AppContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function AppContainer({ children, className }: AppContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full px-5 sm:px-8 lg:px-10 xl:px-12 2xl:px-16', className)}
      style={{ maxWidth: 'var(--layout-container)' }}
    >
      {children}
    </div>
  );
}
