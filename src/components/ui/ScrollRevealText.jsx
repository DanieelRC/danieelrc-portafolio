import { motion, useTransform } from 'framer-motion'

/**
 * <ScrollRevealText> — párrafo que se "ilumina" palabra por palabra conforme
 * avanza el scroll.
 *
 * Recibe `progress` (un MotionValue 0→1, normalmente de useScroll) y reparte
 * ese rango entre las palabras: la palabra i pasa de tenue a opaca cuando el
 * progreso cruza su tramo.
 *
 * Marcado: lo que va entre *asteriscos* se pinta como énfasis (itálica serif
 * en color de acento).
 *
 * AJUSTES:
 *  • DIM       opacidad de las palabras aún no leídas
 *  • OVERLAP   cuántas palabras se iluminan "a la vez" (suaviza el barrido)
 */
const DIM = 0.14
const OVERLAP = 4

function parse(text) {
  let emphasis = false
  return text.split(' ').map((raw) => {
    let word = raw
    let em = emphasis
    if (word.startsWith('*')) {
      em = true
      emphasis = true
      word = word.slice(1)
    }
    if (word.endsWith('*')) {
      emphasis = false
      word = word.slice(0, -1)
    }
    return { word, em }
  })
}

function Word({ children, em, range, progress }) {
  const opacity = useTransform(progress, range, [DIM, 1])
  return (
    <motion.span
      style={{ opacity }}
      className={em ? 'font-serif italic text-accent' : undefined}
    >
      {children}{' '}
    </motion.span>
  )
}

export default function ScrollRevealText({ text, progress, className = '' }) {
  const words = parse(text)
  const n = words.length

  return (
    <p className={className}>
      {words.map(({ word, em }, i) => (
        <Word
          key={i}
          em={em}
          progress={progress}
          range={[i / (n + OVERLAP), (i + OVERLAP) / (n + OVERLAP)]}
        >
          {word}
        </Word>
      ))}
    </p>
  )
}

/** Versión estática (reduced-motion): mismo marcado, todo visible. */
export function StaticRevealText({ text, className = '' }) {
  return (
    <p className={className}>
      {parse(text).map(({ word, em }, i) => (
        <span key={i} className={em ? 'font-serif italic text-accent' : undefined}>
          {word}{' '}
        </span>
      ))}
    </p>
  )
}
