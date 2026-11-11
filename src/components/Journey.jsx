import { useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import SectionLabel from './ui/SectionLabel'
import SplitText from './ui/SplitText'
import { journey } from '../data/content'
import { EASE } from '../lib/motion'

/**
 * TRAYECTORIA — línea de tiempo que se dibuja con el scroll.
 *
 * La línea de acento es un div con `scaleY` ligado al progreso del scroll
 * dentro de la lista: crece desde arriba conforme se baja. Cada nodo se
 * enciende cuando su entrada cruza el centro de la pantalla.
 *
 * AJUSTES:
 *  • `offset` del useScroll = en qué punto de la pantalla "va" la punta
 *    de la línea (0.6 = al 60% de la altura)
 *  • `margin` del useInView de <Entry> = cuándo se enciende cada nodo
 */
export default function Journey() {
  const listRef = useRef(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 0.6', 'end 0.6'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section id="trayectoria" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <SectionLabel index="04">Trayectoria</SectionLabel>

        <div className="mt-10 grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          {/* Título, fijo en escritorio mientras la línea avanza */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SplitText
              as="h2"
              text="Formación y capacitación"
              className="font-display text-[clamp(2.6rem,5.5vw,5rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-bone"
            />
            <p className="mt-6 max-w-sm text-base leading-relaxed text-ash">
              Formación politécnica en programación e inteligencia artificial,
              complementada con capacitación en ciberseguridad y cómputo en la
              nube.
            </p>
          </div>

          <ol ref={listRef} className="relative">
            {/* Riel gris + línea de acento que crece */}
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-[5px] top-0 w-px bg-bone/15"
            />
            <motion.span
              aria-hidden="true"
              style={{ scaleY: reduce ? 1 : scaleY }}
              className="absolute bottom-0 left-[5px] top-0 w-px origin-top bg-accent"
            />

            {journey.map((item) => (
              <Entry key={item.title} item={item} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Entry({ item }) {
  const ref = useRef(null)
  // "Activo" cuando la entrada cruza la franja central de la pantalla.
  const lit = useInView(ref, { margin: '0px 0px -40% 0px', once: true })

  return (
    <li ref={ref} className="relative pb-14 pl-10 last:pb-0 sm:pl-14">
      {/* Nodo */}
      <span
        aria-hidden="true"
        className={`absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border transition-all duration-500 ${
          lit
            ? 'scale-100 border-accent bg-accent shadow-[0_0_0_5px_color-mix(in_oklab,var(--color-accent)_18%,transparent)]'
            : 'scale-75 border-bone/40 bg-ink'
        }`}
      />

      <motion.div
        initial={{ opacity: 0, x: 28 }}
        animate={lit ? { opacity: 1, x: 0 } : { opacity: 0, x: 28 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-ash">
          <span className="text-accent">{item.when}</span>
          <span aria-hidden="true">·</span>
          <span>{item.tag}</span>
        </p>
        <h3 className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2.2rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-bone">
          {item.title}
        </h3>
        <p className="mt-1.5 font-serif text-xl italic text-bone/70">{item.org}</p>

        {item.points.length > 0 && (
          <ul className="mt-5 max-w-xl space-y-3">
            {item.points.map((point) => (
              <li key={point} className="flex gap-4 text-sm leading-relaxed text-ash">
                <span aria-hidden="true" className="mt-[0.75em] h-px w-4 shrink-0 bg-bone/30" />
                {point}
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </li>
  )
}
