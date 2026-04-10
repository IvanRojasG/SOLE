export const theme = {
  colors: {
    ink: '#06152f',
    surface: '#0c245c',
    surfaceElevated: '#13357a',
    card: '#163b88',
    line: 'rgba(250,250,250,0.14)',
    text: '#fafafa',
    textMuted: '#c8d8fb',
    primary: '#005cff',
    primarySoft: '#78a8ff',
    secondary: '#cfe0ff',
    secondarySoft: '#eef4ff',
    accent: '#8fb6ff',
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
    soft: '0 18px 50px rgba(2, 14, 40, 0.28)',
    glow: '0 0 0 1px rgba(250,250,250,0.08), 0 24px 70px rgba(0, 92, 255, 0.22)',
    lift: '0 24px 80px rgba(0, 11, 32, 0.34)',
  },
  radius: {
    lg: '1.5rem',
    xl: '2rem',
    pill: '999px',
  },
} as const;

export type ThemeConfig = typeof theme;
