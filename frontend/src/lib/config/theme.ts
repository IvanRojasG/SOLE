export const theme = {
  colors: {
    ink: '#061326',
    surface: '#0a1f44',
    surfaceElevated: '#102f64',
    card: '#143b76',
    line: 'rgba(226,232,240,0.16)',
    text: '#fafafa',
    textMuted: '#c7d7ee',
    primary: '#005cff',
    primarySoft: '#74a7ff',
    secondary: '#14b8a6',
    secondarySoft: '#e0f7f4',
    accent: '#f59e0b',
    success: '#7fe0b5',
    danger: '#ff8f9c',
  },
  typography: {
    display: '"Anton", sans-serif',
    body: '"Quicksand", sans-serif',
  },
  spacing: {
    sectionY: 'clamp(3.5rem, 6vw, 6.5rem)',
    container: '1280px',
    nav: '4.5rem',
  },
  shadows: {
    soft: '0 18px 50px rgba(2, 14, 40, 0.24)',
    glow: '0 0 0 1px rgba(250,250,250,0.08), 0 24px 70px rgba(0, 92, 255, 0.18)',
    lift: '0 24px 80px rgba(0, 11, 32, 0.3)',
  },
  radius: {
    lg: '1rem',
    xl: '1.5rem',
    pill: '999px',
  },
} as const;

export type ThemeConfig = typeof theme;
