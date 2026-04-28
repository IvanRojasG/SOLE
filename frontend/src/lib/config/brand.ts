export const brand = {
  name: 'SOLE Fitness',
  shortName: 'SOLE',
  tagline: 'Disciplina mensual. Rendimiento visible.',
  description:
    'SOLE Fitness presenta Burn the Ships!, un reto de aniversario de cinco semanas construido para activar comunidad, constancia e impacto visible.',
  navigation: [
    { label: 'Inicio', href: '/' },
    { label: 'Reto', href: '/reto' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'Proposito', href: '/proposito' },
    { label: 'Impacto', href: '/impacto' },
    { label: 'Testimonios', href: '/testimonios' },
    { label: 'Contacto', href: '/contacto' },
  ],
  cta: {
    primary: 'Conocer el reto',
    secondary: 'Ver el proposito',
  },
  assets: {
    officialBlue: '/brand/sole-logo-blue.png',
    officialWhiteCropped: '/brand/sole-logo-white-cropped.png',
    officialWhite: '/brand/sole-logo-white.png',
    poster: '/brand/og-placeholder.svg',
  },
} as const;

export type BrandConfig = typeof brand;
