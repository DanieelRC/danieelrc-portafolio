import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { maskUp } from '../../lib/motion'

/**
 * <SplitText> — texto que sube desde detrás de una máscara, en cascada.
 *
 * Cada palabra va dentro de una caja con `overflow-hidden` (la máscara) y su
 * contenido arranca desplazado 115% hacia abajo, fuera de la caja.
 *
 *   <SplitText text="Hablemos" by="char" as="h2" />
 *
 * Props de ajuste:
 *  • by       'word' (por palabra) | 'char' (por letra)
 *  • stagger  segundos entre un elemento y el siguiente
 *  • delay    segundos antes de empezar
 *  • play     si se omite, anima al entrar en pantalla; si se pasa un boolean,
 *             el padre decide cuándo (el Hero lo usa para esperar al preloader)
 */
export default function SplitText({
  text,
  as = 'span',
  by = 'word',
  className = '',
  stagger,
  delay = 0,
  play,
  amount = 0.5,
}) {
  const Tag = motion[as] ?? motion.span
  const words = text.split(' ')

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger ?? (by === 'char' ? 0.035 : 0.07),
        delayChildren: delay,
      },
    },
  }

  const trigger =
    play === undefined
      ? { whileInView: 'visible', viewport: { once: true, amount } }
      : { animate: play ? 'visible' : 'hidden' }

  return (
    // aria-label entrega el texto completo al lector de pantalla; las piezas
    // sueltas se ocultan para que no lo deletree.
    <Tag
      className={className}
      aria-label={text}
      variants={container}
      initial="hidden"
      {...trigger}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          {/* El padding + margen negativo agranda la máscara lo justo para no
              recortar acentos (Í, ó) ni descendentes (g, p, j). */}
          <span
            aria-hidden="true"
            className="-my-[0.12em] inline-block overflow-hidden py-[0.12em] align-bottom"
          >
            {by === 'char' ? (
              [...word].map((char, j) => (
                <motion.span key={j} variants={maskUp} className="inline-block">
                  {char}
                </motion.span>
              ))
            ) : (
              <motion.span variants={maskUp} className="inline-block">
                {word}
              </motion.span>
            )}
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}
