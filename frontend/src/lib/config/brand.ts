export const brand = {
  name: 'SOLE Fitness',
  shortName: 'SOLE',
  tagline: 'Disciplina mensual. Rendimiento visible.',
  description:
    'SOLE Fitness construye experiencias digitales para retos deportivos con una identidad intensa, clara y enfocada en progreso medible.',
  navigation: [
    { label: 'Inicio', href: '/' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'Retos', href: '/challenges' },
    { label: 'Atletas', href: '/athletes' },
    { label: 'Contacto', href: '/#cta' },
  ],
  cta: {
    primary: 'Ver el reto del mes',
    secondary: 'Conocer la dinámica',
  },
  assets: {
    officialBlue: '/brand/sole-logo-blue.png',
    officialWhiteCropped: '/brand/sole-logo-white-cropped.png',
    officialWhite: '/brand/sole-logo-white.png',
    poster: '/brand/og-placeholder.svg',
  },
} as const;

export type BrandConfig = typeof brand;
