import { motion } from 'framer-motion'
import SectionLabel from './ui/SectionLabel'
import SplitText from './ui/SplitText'
import TechLogo from './ui/TechLogos'
import { logoMarquee, skillGroups } from '../data/content'
import { drawLine, EASE, maskUp, stagger, viewportOnce } from '../lib/motion'

/**
 * HABILIDADES — índice de filas.
 *
 * Al entrar en pantalla, cada fila: dibuja su línea superior (scaleX), sube
 * su título desde una máscara y suelta sus chips en cascada.
 * Al pasar el cursor, un bloque del color de acento sube desde abajo y la
 * fila se invierte (texto oscuro sobre acento).
 *
 * AJUSTES:
 *  • `stagger(0.04, 0.25)` = ritmo de los chips
 *  • la duración del relleno al hover está en `duration-500` del ::before
 */
const chip = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export default function Skills() {
  return (
    <section id="habilidades" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <SectionLabel index="03">Habilidades</SectionLabel>

        <div className="mt-10 grid gap-6 md:grid-cols-2 md:items-end">
          <SplitText
            as="h2"
            text="Del modelo a producción"
            className="font-display text-[clamp(2.6rem,6.5vw,6rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-bone"
          />
          <p className="max-w-md text-base leading-relaxed text-ash md:justify-self-end">
            Las herramientas con las que construyo: del lenguaje y el modelo, al
            backend, el despliegue y la interfaz que la gente termina usando.
          </p>
        </div>

        <ul className="mt-14">
          {skillGroups.map((group, i) => (
            <motion.li
              key={group.title}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="group relative"
            >
              {/* Línea superior que se dibuja */}
              <motion.span
                aria-hidden="true"
                variants={drawLine}
                className="absolute inset-x-0 top-0 block h-px origin-left bg-bone/15"
              />
              {/* Relleno de acento que sube al hover (solo transform) */}
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
              />

              <div className="relative grid gap-5 px-0 py-8 transition-[padding] duration-500 group-hover:px-5 md:grid-cols-[4rem_1fr_1.6fr] md:items-center md:gap-8">
                <span className="label text-ash transition-colors duration-300 group-hover:text-ink/60">
                  0{i + 1}
                </span>

                <h3 className="overflow-hidden font-display text-[clamp(1.7rem,3.2vw,2.8rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-bone transition-colors duration-300 group-hover:text-ink">
                  <motion.span variants={maskUp} className="block">
                    {group.title}
                  </motion.span>
                </h3>

                <motion.ul
                  variants={stagger(0.04, 0.25)}
                  className="flex flex-wrap gap-2"
                >
                  {group.items.map((item) => (
                    <motion.li
                      key={item}
                      variants={chip}
                      className="rounded-full border border-bone/20 px-3.5 py-1.5 text-sm text-bone/85 transition-colors duration-300 group-hover:border-ink/30 group-hover:text-ink"
                    >
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.li>
          ))}
          <li aria-hidden="true" className="h-px bg-bone/15" />
        </ul>
      </div>

      {/* --- Carrusel de logos ---
          Pista duplicada y desplazada -50%: el bucle es imperceptible.
          Se pausa al pasar el cursor; el logo bajo el cursor toma su color
          de marca. Velocidad: --animate-marquee en index.css. */}
      <div className="group/marquee relative mt-20 overflow-hidden border-y border-bone/15 py-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-ink to-transparent sm:w-40"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-ink to-transparent sm:w-40"
        />

        <div className="flex w-max animate-marquee gap-4 pr-4 group-hover/marquee:[animation-play-state:paused]">
          {[...logoMarquee, ...logoMarquee].map((tech, i) => (
            <div
              key={`${tech.name}-${i}`}
              aria-hidden={i >= logoMarquee.length ? 'true' : undefined}
              className="group/item flex shrink-0 items-center gap-3 rounded-full border border-bone/10 px-5 py-2.5 transition-colors duration-300 hover:border-bone/30"
            >
              <TechLogo
                brand={tech.brand}
                glyph={tech.glyph}
                className="h-5 w-5 shrink-0 text-ash transition-all duration-300 group-hover/item:scale-110 group-hover/item:text-[var(--brand)]"
              />
              <span className="label whitespace-nowrap text-ash transition-colors duration-300 group-hover/item:text-bone">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
