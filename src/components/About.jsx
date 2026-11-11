import { useRef } from 'react'
import { motion, useReducedMotion, useScroll } from 'framer-motion'
import ScrollRevealText, { StaticRevealText } from './ui/ScrollRevealText'
import SectionLabel from './ui/SectionLabel'
import Counter from './ui/Counter'
import { about } from '../data/content'
import { fadeUp, stagger, viewportOnce } from '../lib/motion'

/**
 * PERFIL
 *  1. Bloque FIJADO: la sección mide PIN_HEIGHT de alto y su contenido es
 *     `sticky`, así que se queda quieto mientras el scroll "lee" el párrafo
 *     palabra por palabra (ScrollRevealText).
 *  2. Datos: contadores que suben al entrar en pantalla + ficha rápida.
 *
 * AJUSTE: PIN_HEIGHT. Más alto = el párrafo tarda más scroll en iluminarse.
 */
const PIN_HEIGHT = '230vh'

const statementClass =
  'max-w-5xl font-display text-[clamp(1.45rem,3.5vw,3.2rem)] font-medium leading-[1.22] tracking-[-0.02em] text-bone'

export default function About() {
  const pinRef = useRef(null)
  const reduce = useReducedMotion()

  // 0 al fijarse el bloque, 1 justo antes de soltarse.
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section id="perfil" className="relative">
      {reduce ? (
        // Sin movimiento: el párrafo completo, sin fijar.
        <div className="mx-auto max-w-[1400px] px-6 py-24 sm:px-10">
          <SectionLabel index="01">{about.label}</SectionLabel>
          <StaticRevealText text={about.statement} className={`mt-12 ${statementClass}`} />
        </div>
      ) : (
        <div ref={pinRef} style={{ height: PIN_HEIGHT }} className="relative">
          <div className="sticky top-0 flex h-svh flex-col justify-center">
            <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-10">
              <SectionLabel index="01">{about.label}</SectionLabel>
              <ScrollRevealText
                text={about.statement}
                progress={scrollYProgress}
                className={`mt-10 sm:mt-14 ${statementClass}`}
              />
            </div>
          </div>
        </div>
      )}

      {/* --- Cifras + ficha --- */}
      <div className="mx-auto max-w-[1400px] px-6 pb-24 sm:px-10 sm:pb-32">
        <motion.dl
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid border-t border-bone/15 sm:grid-cols-2 lg:grid-cols-4"
        >
          {about.stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="border-b border-bone/15 py-8 sm:pr-8 lg:border-b-0"
            >
              <dt className="font-display text-[clamp(2.6rem,5vw,4.5rem)] font-semibold leading-none tracking-tighter text-bone">
                {stat.value !== undefined ? (
                  <Counter to={stat.value} className="tabular-nums" />
                ) : (
                  <span className="font-serif text-[0.62em] font-normal italic tracking-normal text-accent">
                    {stat.text}
                  </span>
                )}
              </dt>
              <dd className="mt-4 max-w-[26ch] text-sm leading-relaxed text-ash">
                {stat.label}
              </dd>
            </motion.div>
          ))}
        </motion.dl>

        <motion.dl
          variants={stagger(0.06, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-4 grid grid-cols-2 gap-x-8 border-t border-bone/15 lg:grid-cols-4"
        >
          {about.facts.map((fact) => (
            <motion.div key={fact.k} variants={fadeUp} className="py-6">
              <dt className="label text-ash">{fact.k}</dt>
              <dd className="mt-2 font-display text-lg font-medium text-bone">{fact.v}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}
