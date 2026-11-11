import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import NeuralBackground from './NeuralBackground'
import SplitText from './ui/SplitText'
import Magnetic from './ui/Magnetic'
import Icons from './ui/Icons'
import { hero, profile } from '../data/content'
import { EASE } from '../lib/motion'

/**
 * HERO
 *  • Entrada: el nombre sube letra por letra desde detrás de una máscara
 *    (SplitText), y el resto aparece en cascada. Arranca cuando `ready` es
 *    true, es decir, cuando el preloader empieza a levantar el telón.
 *  • Salida ligada al scroll: mientras se abandona el Hero, el bloque se
 *    encoge, se desvanece y sube más lento que la página (parallax).
 *
 * AJUSTES:
 *  • rangos de `scale` / `opacity` / `y` abajo = intensidad de la salida
 *  • `stagger` y `delay` de cada <SplitText> = ritmo de la entrada
 */
export default function Hero({ ready = true }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  // 0 cuando el Hero ocupa la pantalla, 1 cuando terminó de salir por arriba.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.86])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  const fade = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 1, ease: EASE, delay },
  })

  return (
    <section
      id="inicio"
      ref={ref}
      className="relative flex min-h-svh flex-col overflow-hidden"
    >
      {/* Red de nodos monocroma. Se pausa sola al salir de pantalla. */}
      <div className="absolute inset-0 opacity-60">
        <NeuralBackground />
      </div>
      {/* Degradado inferior: funde el canvas con la siguiente sección. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent"
      />

      <motion.div
        style={reduce ? undefined : { scale, opacity, y }}
        className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-between px-6 pb-10 pt-28 sm:px-10 sm:pb-14"
      >
        {/* Fila superior */}
        <motion.div
          {...fade(0.1)}
          className="label flex flex-wrap items-center justify-between gap-4 text-ash"
        >
          <span>{hero.eyebrow}</span>
          <span className="flex items-center gap-2.5 text-bone">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {hero.status}
          </span>
        </motion.div>

        {/* Nombre gigante. La última línea va en serif itálica y acento. */}
        <h1
          aria-label={profile.name}
          className="my-10 font-display text-[clamp(3.4rem,13.5vw,13rem)] font-semibold uppercase leading-[0.86] tracking-[-0.045em] text-bone"
        >
          {profile.nameLines.map((line, i) => {
            const last = i === profile.nameLines.length - 1
            return (
              <SplitText
                key={line}
                text={line}
                by="char"
                play={ready}
                delay={0.15 + i * 0.14}
                stagger={0.04}
                className={`block ${
                  last
                    ? 'font-serif font-normal normal-case italic tracking-[-0.02em] text-accent'
                    : ''
                }`}
              />
            )
          })}
        </h1>

        {/* Fila inferior: rol · descripción · CTAs */}
        <div className="grid gap-8 md:grid-cols-[1fr_1.2fr_auto] md:items-end">
          <motion.div {...fade(0.75)}>
            <p className="font-display text-xl font-medium text-bone sm:text-2xl">
              {profile.role}
            </p>
            <p className="label mt-2 text-ash">{profile.focus}</p>
          </motion.div>

          <motion.p
            {...fade(0.85)}
            className="max-w-md text-base leading-relaxed text-ash"
          >
            {hero.tagline}
          </motion.p>

          <motion.div {...fade(0.95)} className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#proyectos"
                className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-4 font-display text-sm font-semibold text-ink transition-transform duration-300 active:scale-95"
              >
                {hero.cta}
                <Icons.arrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contacto"
                className="group inline-flex items-center gap-2.5 rounded-full border border-bone/25 px-7 py-4 font-display text-sm font-semibold text-bone transition-colors duration-300 hover:border-accent hover:text-accent active:scale-95"
              >
                {hero.ctaSecondary}
                <Icons.arrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
