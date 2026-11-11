import {
  siPython,
  siTypescript,
  siJavascript,
  siReact,
  siNodedotjs,
  siPostgresql,
  siSupabase,
  siStripe,
  siGooglegemini,
  siVercel,
  siHostinger,
  siGooglecloud,
  siDocker,
  siMysql,
  siTailwindcss,
  siGit,
  siGithub,
  siClaude,
  siLinux,
  siOpenjdk,
} from 'simple-icons'

/**
 * LOGOS DE TECNOLOGÍAS
 * -----------------------------------------------------------------------------
 * Los logos de marca vienen de `simple-icons`: paths oficiales, empaquetados
 * con el sitio (sin CDN) y con su color de marca (`hex`).
 *
 * PARA AÑADIR UNA MARCA:
 *   1. Impórtala arriba        ->  import { siRedis } from 'simple-icons'
 *   2. Regístrala en BRANDS    ->  redis: siRedis
 *   3. Úsala en content.js     ->  { name: 'Redis', brand: 'redis' }
 *
 * Lo que no existe en el paquete (Azure, MATLAB) usa un glifo propio de GLYPHS.
 */

const BRANDS = {
  python: siPython,
  typescript: siTypescript,
  javascript: siJavascript,
  react: siReact,
  node: siNodedotjs,
  postgresql: siPostgresql,
  supabase: siSupabase,
  stripe: siStripe,
  gemini: siGooglegemini,
  vercel: siVercel,
  hostinger: siHostinger,
  googlecloud: siGooglecloud,
  docker: siDocker,
  mysql: siMysql,
  tailwind: siTailwindcss,
  git: siGit,
  github: siGithub,
  claude: siClaude,
  linux: siLinux,
  java: siOpenjdk,
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
}

const GLYPHS = {
  // Azure no está en simple-icons: glifo genérico de nube.
  cloud: (p) => (
    <svg {...stroke} {...p}>
      <path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 10.5a3.75 3.75 0 0 1-.5 7.5H7Z" />
    </svg>
  ),
  // MATLAB tampoco: glifo de función/onda.
  matlab: (p) => (
    <svg {...stroke} {...p}>
      <path d="M3 17c3.5 0 4.5-10 8-10s4.5 10 8 10" />
      <path d="M3 21h18" opacity=".45" />
    </svg>
  ),
}

/**
 * <TechLogo> — logo de marca o glifo propio.
 *
 * Expone el color oficial como variable CSS `--brand`, para pintarlo al hover
 * con `text-[var(--brand)]` (Tailwind no puede generar clases dinámicas).
 * Los logos muy oscuros (Vercel, GitHub…) usarían negro sobre negro, así que
 * por debajo de cierto brillo se sustituye por el color de texto claro.
 */
function readable(hex) {
  const n = parseInt(hex, 16)
  const luma = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)
  return luma < 70 ? 'var(--color-bone)' : `#${hex}`
}

export default function TechLogo({ brand, glyph, className = '' }) {
  if (brand) {
    const icon = BRANDS[brand]
    if (!icon) return null
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        style={{ '--brand': readable(icon.hex) }}
      >
        <path d={icon.path} />
      </svg>
    )
  }

  const Glyph = GLYPHS[glyph]
  if (!Glyph) return null
  return (
    <Glyph
      aria-hidden="true"
      className={className}
      style={{ '--brand': 'var(--color-accent)' }}
    />
  )
}
