export const publicSite = {
  navigation: [
    { label: 'Inicio', href: '/' },
    { label: 'Reto', href: '/reto' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'Proposito', href: '/proposito' },
    { label: 'Impacto', href: '/impacto' },
    { label: 'Testimonios', href: '/testimonios' },
    { label: 'Contacto', href: '/contacto' },
  ],
  hero: {
    eyebrow: 'Reto de aniversario SOLE',
    title: 'Burn the Ships!',
    subtitle: 'The Challenge',
    summary:
      'Un reto de 5 semanas para empujar disciplina, constancia y comunidad con un lenguaje visual mas limpio, luminoso y directo.',
    ctaPrimary: { label: 'Conocer el reto', href: '/reto' },
    ctaSecondary: { label: 'Ver el proposito', href: '/proposito' },
  },
  intro: {
    title: 'Un reto de 5 semanas que te llevaran al limite',
    body: 'Esta dirigido a todos nuestros clientes internos que quieren poner a prueba su fitness a traves de workouts semanales iniciando la primera semana de Mayo del 04 al 10 y finalizando la semana del 01 al 07 de Junio. La gran final con el top 10 sera el proximo 12 de Junio.',
    caption: '5 semanas de workouts increibles',
  },
  schedule: [
    { label: 'Semana 1', value: '04 al 10 de mayo' },
    { label: 'Semana 2', value: '11 al 17 de mayo' },
    { label: 'Semana 3', value: '18 al 24 de mayo' },
    { label: 'Semana 4', value: '25 al 31 de mayo' },
    { label: 'Semana 5', value: '01 al 07 de junio' },
    { label: 'Gran final', value: '12 de junio' },
  ],
  challengePillars: [
    'Pon a prueba tus habilidades',
    'Enfocate en la constancia',
    'Maximiza tu potencial',
    'Crea comunidad',
    'Entrena con proposito',
    'Disfruta de un ambiente de crecimiento',
  ],
  mission: {
    title: 'Mision',
    body: 'Convertir el aniversario de SOLE en una experiencia competitiva clara, cercana y bien guiada, donde cada semana suba el nivel de compromiso sin perder la energia colectiva del box.',
  },
  vision: {
    title: 'Vision',
    body: 'Diseñar una experiencia memorable que haga visible el progreso de cada atleta y proyecte a SOLE como una comunidad que entrena con metodo, intensidad y identidad propia.',
  },
  coach: {
    name: 'Coach Mau',
    body: 'La propuesta posiciona al coach como la voz que acompaña, reta y da contexto al proceso completo: del primer workout a la final.',
  },
  impact: {
    title: 'Impacto',
    body: 'El reto esta pensado para elevar adherencia, conversación y sentido de logro. No es solo una serie de workouts; es una narrativa de progreso de cinco semanas.',
    points: [
      'Rutina semanal con foco claro y expectativa sostenida.',
      'Lectura inmediata del avance del atleta y del momentum del reto.',
      'Contenido facil de compartir para reforzar comunidad y aniversario.',
      'Final con top 10 como cierre aspiracional de alto valor emocional.',
    ],
  },
  testimonials: {
    title: 'Testimonios',
    body: 'Historias reales de atletas que viven el proceso dentro de SOLE y comparten lo que el entrenamiento ha construido en ellos.',
    videos: [
      {
        title: 'Testimonio 01',
        youtubeUrl: 'https://www.youtube.com/shorts/iSH8DDReltM',
      },
      {
        title: 'Testimonio 02',
        youtubeUrl: 'https://www.youtube.com/watch?v=GFUImejEQ2s',
      },
    ],
  },
  contact: {
    title: 'Contacto',
    body: 'Si quieres activar esta experiencia para el aniversario, la pagina ya queda estructurada para presentar el reto, sumar testimonios y centralizar el siguiente paso comercial o interno.',
    primaryCta: { label: 'Ir a contacto', href: '/contacto' },
  },
  gallery: [
    {
      src: '/challenge-gallery/_20A8051-Enhanced-NR.jpg',
      alt: 'Atleta de SOLE entrenando durante el reto Burn the Ships',
      caption: 'Energia real del reto en el box.',
    },
    {
      src: '/challenge-gallery/_20A7570-Enhanced-NR.jpg',
      alt: 'Comunidad de SOLE compartiendo una sesion de entrenamiento',
      caption: 'Cinco semanas para entrenar con proposito.',
    },
    {
      src: '/challenge-gallery/_20A7555-Enhanced-NR.jpg',
      alt: 'Atletas preparandose para un workout del reto de aniversario',
      caption: 'Disciplina, constancia y comunidad.',
    },
    {
      src: '/challenge-gallery/_20A7777-Enhanced-NR.jpg',
      alt: 'Atleta completando un workout intenso dentro del box',
      caption: 'Cada semana sube el nivel.',
    },
    {
      src: '/challenge-gallery/_20A7839-Enhanced-NR.jpg',
      alt: 'Detalle de entrenamiento funcional en SOLE Fitness',
      caption: 'Progreso visible desde el primer workout.',
    },
    {
      src: '/challenge-gallery/IMG_8987-Enhanced-NR.jpg',
      alt: 'Momento del reto Burn the Ships en SOLE Fitness',
      caption: 'Una experiencia competitiva y cercana.',
    },
    {
      src: '/challenge-gallery/_20A8120-Enhanced-NR.jpg',
      alt: 'Ambiente de entrenamiento y comunidad en SOLE Fitness',
      caption: 'El cierre empieza con el compromiso diario.',
    },
  ],
} as const;

export type PublicSiteConfig = typeof publicSite;
