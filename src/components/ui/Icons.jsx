/**
 * Iconos SVG inline (sin dependencias externas).
 * Todos heredan el color con `currentColor` y el tamaño con la clase que
 * les pases: <Icons.brain className="h-6 w-6 text-neon-violet" />
 */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
  xmlns: 'http://www.w3.org/2000/svg',
}

export const Icons = {
  // IA & Data — nodo con ramificaciones (red neuronal)
  brain: (props) => (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="2.6" />
      <circle cx="4.5" cy="5.5" r="1.6" />
      <circle cx="19.5" cy="5.5" r="1.6" />
      <circle cx="4.5" cy="18.5" r="1.6" />
      <circle cx="19.5" cy="18.5" r="1.6" />
      <path d="m6 6.8 3.9 3.7M18 6.8l-3.9 3.7M6 17.2l3.9-3.7M18 17.2l-3.9-3.7" />
    </svg>
  ),

  // Backend — racks apilados
  server: (props) => (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="6" rx="1.6" />
      <rect x="3" y="14" width="18" height="6" rx="1.6" />
      <path d="M7 7h.01M7 17h.01" />
      <path d="M11 7h5M11 17h5" />
    </svg>
  ),

  // Frontend — capas
  layers: (props) => (
    <svg {...base} {...props}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
      <path d="m3 16.5 9 5 9-5" opacity=".5" />
    </svg>
  ),

  arrowDown: (props) => (
    <svg {...base} {...props}>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </svg>
  ),

  arrowUpRight: (props) => (
    <svg {...base} {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  ),

  mail: (props) => (
    <svg {...base} {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.4" />
      <path d="m3 7 8.2 5.6a1.5 1.5 0 0 0 1.6 0L21 7" />
    </svg>
  ),

  github: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.47c.53.1.72-.23.72-.5v-1.94c-2.93.64-3.55-1.26-3.55-1.26-.48-1.22-1.17-1.55-1.17-1.55-.96-.65.07-.64.07-.64 1.06.08 1.62 1.09 1.62 1.09.94 1.62 2.47 1.15 3.07.88.1-.69.37-1.15.67-1.42-2.34-.27-4.8-1.17-4.8-5.2 0-1.15.41-2.09 1.09-2.82-.11-.27-.47-1.34.1-2.79 0 0 .88-.28 2.9 1.08a10 10 0 0 1 5.28 0c2.01-1.36 2.9-1.08 2.9-1.08.57 1.45.21 2.52.1 2.79.68.73 1.09 1.67 1.09 2.82 0 4.04-2.47 4.93-4.82 5.19.38.33.72.97.72 1.96v2.9c0 .28.19.61.73.5A10.5 10.5 0 0 0 12 1.5Z" />
    </svg>
  ),

  linkedin: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.8v1.64h.05c.53-.95 1.83-1.96 3.77-1.96 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.63c0-1.34-.03-3.07-1.94-3.07-1.94 0-2.24 1.46-2.24 2.97V21h-4V9Z" />
    </svg>
  ),

  send: (props) => (
    <svg {...base} {...props}>
      <path d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8 21 3Z" />
    </svg>
  ),

  check: (props) => (
    <svg {...base} {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  ),

  copy: (props) => (
    <svg {...base} {...props}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </svg>
  ),
}

export default Icons
