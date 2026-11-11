/**
 * FUENTE ÚNICA DE CONTENIDO
 * -----------------------------------------------------------------------------
 * Todo el texto de la página vive aquí. Para actualizar el portafolio no hace
 * falta tocar ningún componente: edita este archivo.
 */

export const profile = {
  name: 'Daniel Rodríguez Carreón',
  nameLines: ['Daniel', 'Rodríguez', 'Carreón'],
  initials: 'DRC',
  role: 'Ingeniero en Inteligencia Artificial',
  focus: 'Full-Stack · Integración de LLMs',
  location: 'Ciudad de México, México',
  email: 'danieeelrc@gmail.com',
  github: 'https://github.com/DanieelRC',
  githubUser: 'DanieelRC',
  linkedin: 'https://linkedin.com/in/danieeelrc',
  linkedinUser: 'danieeelrc',
}

export const nav = [
  { href: '#perfil', label: 'Perfil' },
  { href: '#proyectos', label: 'Proyectos' },
  { href: '#habilidades', label: 'Habilidades' },
  { href: '#trayectoria', label: 'Trayectoria' },
  { href: '#contacto', label: 'Contacto' },
]

export const hero = {
  eyebrow: 'Portafolio — 2026',
  status: 'Disponible para nuevos proyectos',
  tagline:
    'Construyo productos web y móviles de principio a fin, y les integro modelos de lenguaje que resuelven problemas reales.',
  cta: 'Ver proyectos',
  ctaSecondary: 'Escríbeme',
}

/**
 * PERFIL — párrafo que se ilumina palabra por palabra con el scroll.
 * Lo que va entre *asteriscos* se pinta en itálica con el color de acento.
 */
export const about = {
  label: 'Perfil',
  statement:
    'Soy estudiante de Ingeniería en *Inteligencia Artificial* en ESCOM IPN, con enfoque en desarrollo *full-stack* e integración de *modelos de lenguaje.* Mi base es el software —TypeScript, Python, React y Node.js— con proyectos desplegados en Vercel, Hostinger y Azure. Me interesa construir *soluciones prácticas con IA* y explicar las decisiones técnicas a personas no técnicas.',
  // `value` numérico -> contador animado. `text` -> se muestra tal cual.
  stats: [
    { value: 5, label: 'proyectos construidos de principio a fin' },
    { value: 3, label: 'plataformas de despliegue: Vercel, Hostinger y Azure' },
    { value: 1, label: 'app móvil en producción para el negocio de un cliente' },
    {
      text: 'meses → semanas',
      label: 'potencial de reducción al formular proyectos de ley con LegislaBot',
    },
  ],
  facts: [
    { k: 'Base', v: 'Ciudad de México' },
    { k: 'Idiomas', v: 'Español · Inglés B2' },
    { k: 'Enfoque', v: 'Full-stack + LLMs' },
    { k: 'Formación', v: 'ESCOM IPN' },
  ],
}

/** Cinta gigante que reacciona a la velocidad del scroll. */
export const bigMarquee = [
  'Inteligencia Artificial',
  'Full-Stack',
  'LLMs',
  'RAG',
  'React',
  'Node.js',
  'Python',
  'TypeScript',
]

/**
 * PROYECTOS — en orden de más reciente a más antiguo.
 * `link` es opcional. `highlight` es el dato que se destaca en grande.
 */
export const projects = [
  {
    id: 'ecommerce',
    name: 'E-commerce con IA',
    kind: 'Recomendaciones por IA y dropshipping automatizado',
    role: 'Full Stack Engineer · CID',
    period: 'Mar 2026 — Presente',
    highlight: 'RAG sobre el catálogo',
    bullets: [
      'Plataforma de e-commerce con pasarela de pagos en Stripe y cumplimiento automatizado de pedidos mediante la API de CJDropshipping.',
      'Chatbot de recomendación de compras con la API de Grok (xAI), aplicando RAG sobre una base de datos vectorial en PostgreSQL con el catálogo de productos.',
      'Arquitectura de búsqueda semántica que habilita recomendaciones personalizadas en tiempo real a partir de las consultas de los usuarios.',
    ],
    stack: ['Stripe', 'Grok (xAI)', 'RAG', 'PostgreSQL vectorial', 'CJDropshipping API'],
  },
  {
    id: 'pos',
    name: 'POS Móvil',
    kind: 'Punto de venta Android para una paletería',
    role: 'Desarrollo completo · cliente real',
    period: 'Abr 2026 — Ago 2026',
    highlight: 'En producción',
    bullets: [
      'Aplicación de punto de venta para Android con React Native, comercializada e implementada en producción para el negocio de un cliente.',
      'Backend integrado con una base de datos en Supabase para gestionar inventario, ventas y control de caja en tiempo real.',
    ],
    stack: ['React Native', 'Android', 'Supabase', 'Tiempo real'],
  },
  {
    id: 'comunidad-viva',
    name: 'Comunidad Viva',
    kind: 'Gestión urbana y participación ciudadana',
    role: 'Coordinación del equipo · Hackatón Genius Arena 2026',
    period: 'Feb 2026 — Abr 2026',
    highlight: 'Hackatón Genius Arena',
    bullets: [
      'Coordiné al equipo de desarrollo para diseñar una plataforma tipo red social orientada a la organización ciudadana y la priorización de infraestructura pública.',
      'Modelos de Gemini e IBM Watson para simular visualmente el impacto de las obras, y Google Maps Platform para el mapeo georreferenciado de las propuestas.',
      'Sistema de toma de decisiones con cálculo presupuestario automatizado y priorización democrática de las necesidades vecinales.',
    ],
    stack: ['Gemini', 'IBM Watson', 'Google Maps Platform', 'Liderazgo técnico'],
  },
  {
    id: 'saes',
    name: 'Gestión Escolar + Asistente',
    kind: 'Sistema tipo SAES con asistente de normativa académica',
    role: 'Desarrollo full-stack e IA',
    period: 'Ago 2025 — Dic 2025',
    highlight: 'LLM local en CPU',
    bullets: [
      'Sistema de gestión escolar tipo SAES (IPN) con React, Node.js y una base de datos SQL interna (SAES-R).',
      'Dos versiones del chatbot de normativa: una sobre la API de un LLM externo y otra con un modelo Phi de Microsoft cuantizado, ejecutado localmente en CPU.',
      'Lógica para resolver dudas de normativa y situaciones escolares: riesgo de reprobación, dictaminado, alumno regular o irregular.',
    ],
    stack: ['React', 'Node.js', 'SQL', 'Phi cuantizado', 'LLM API'],
  },
  {
    id: 'legislabot',
    name: 'LegislaBot',
    kind: 'Asistencia en la formulación de proyectos de ley',
    role: 'Diseño e implementación · SCRUM',
    period: 'Ene 2025 — Jul 2025',
    highlight: 'Reconocido por el Senado',
    link: { href: 'https://legisla-bot.vercel.app/', label: 'legisla-bot.vercel.app' },
    bullets: [
      'Aplicación web completa con TypeScript, React y Node.js bajo metodología ágil SCRUM.',
      'Tecnologías de PLN para automatizar la estructuración y redacción de borradores de proyectos de ley para legisladores estatales.',
      'Demostró el potencial de reducir la formulación de 1-3 meses a 1-3 semanas, logro reconocido por el Senado de la República.',
    ],
    stack: ['TypeScript', 'React', 'Node.js', 'PLN', 'Vercel'],
  },
]

/** HABILIDADES — filas del índice. */
export const skillGroups = [
  {
    title: 'Lenguajes',
    items: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C', 'MATLAB', 'SQL', 'HTML', 'CSS'],
  },
  {
    title: 'IA & LLMs',
    items: [
      'Integración de LLMs',
      'RAG',
      'Búsqueda semántica',
      'Bases vectoriales',
      'PLN',
      'Modelos cuantizados en CPU',
      'Modelos predictivos',
      'Algoritmos bioinspirados',
    ],
  },
  {
    title: 'Frontend & Móvil',
    items: ['React', 'React Native', 'Vite', 'Tailwind CSS'],
  },
  {
    title: 'Backend & Datos',
    items: ['Node.js', 'Flask', 'PostgreSQL', 'Supabase', 'MySQL', 'SQLite', 'Docker', 'Stripe API'],
  },
  {
    title: 'Cloud & Deploy',
    items: ['Vercel', 'Hostinger', 'Azure', 'Google Cloud'],
  },
  {
    title: 'Herramientas',
    items: ['Git', 'GitHub', 'Claude Code', 'Linux', 'SCRUM'],
  },
]

/**
 * Carrusel de logos.
 *  • `brand` -> logo oficial (simple-icons). Ver BRANDS en ui/TechLogos.jsx.
 *  • `glyph` -> icono propio para lo que no tiene logo en el paquete.
 */
export const logoMarquee = [
  { name: 'Python', brand: 'python' },
  { name: 'TypeScript', brand: 'typescript' },
  { name: 'JavaScript', brand: 'javascript' },
  { name: 'React', brand: 'react' },
  { name: 'Node.js', brand: 'node' },
  { name: 'PostgreSQL', brand: 'postgresql' },
  { name: 'Supabase', brand: 'supabase' },
  { name: 'Stripe', brand: 'stripe' },
  { name: 'Gemini', brand: 'gemini' },
  { name: 'Vercel', brand: 'vercel' },
  { name: 'Hostinger', brand: 'hostinger' },
  { name: 'Azure', glyph: 'cloud' },
  { name: 'Google Cloud', brand: 'googlecloud' },
  { name: 'Docker', brand: 'docker' },
  { name: 'MySQL', brand: 'mysql' },
  { name: 'Tailwind CSS', brand: 'tailwind' },
  { name: 'Git', brand: 'git' },
  { name: 'GitHub', brand: 'github' },
  { name: 'Claude Code', brand: 'claude' },
  { name: 'Linux', brand: 'linux' },
  { name: 'Java', brand: 'java' },
  { name: 'MATLAB', glyph: 'matlab' },
]

/** TRAYECTORIA — formación, capacitación y certificaciones. */
export const journey = [
  {
    when: 'Nov 2026',
    tag: 'Capacitación',
    title: 'Bootcamp de Ciberseguridad',
    org: 'Deloitte Impact Makers 2026',
    points: [
      'Áreas de Cyber de Deloitte: gobierno y estrategia, privacidad y protección de datos, seguridad en la nube, resiliencia, detección y respuesta, e identidades.',
      'Simulación de crisis por ransomware en una empresa financiera ficticia: identificación, contención, comunicación, cumplimiento legal y recuperación.',
      'Impacto de la IA en ciberseguridad y riesgos de la computación cuántica para la criptografía.',
    ],
  },
  {
    when: 'Feb 2023 — Actualidad',
    tag: 'Educación',
    title: 'Ingeniería en Inteligencia Artificial',
    org: 'ESCOM · Instituto Politécnico Nacional',
    points: [
      '8.º semestre. Enfoque principal: diseño y construcción de modelos de IA, del modelado al despliegue.',
    ],
  },
  {
    when: 'Ago 2019 — Jul 2022',
    tag: 'Educación',
    title: 'Carrera Técnica en Programación',
    org: 'CECyT 9 · Instituto Politécnico Nacional',
    points: [
      'Programación en Java, desarrollo de interfaces gráficas y aplicaciones web con Servlets.',
    ],
  },
  {
    when: 'Certificación',
    tag: 'Cloud',
    title: 'Google Cloud Computing Foundations Certificate',
    org: 'Google Cloud',
    points: [],
  },
  {
    when: 'Certificación',
    tag: 'Idiomas',
    title: 'Inglés B2',
    org: 'TOEFL ITP',
    points: [],
  },
]

export const contact = {
  label: 'Contacto',
  title: 'Hablemos',
  blurb:
    '¿Tienes un proyecto, una vacante o una idea que quieras aterrizar con IA? Mándame un correo y te respondo lo antes posible.',
  mailSubject: 'Contacto desde tu portafolio',
}
