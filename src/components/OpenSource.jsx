import { motion } from 'framer-motion'
import SplitText from './ui/SplitText'
import Icons from './ui/Icons'
import { githubUrl, moreProjects } from '../data/content'
import { EASE, stagger, viewportOnce } from '../lib/motion'

/**
 * MÁS EN GITHUB — cuadrícula de proyectos secundarios bajo los destacados.
 *
 * Animación: las tarjetas entran en cascada (subida + leve escala). Al pasar
 * el cursor, una línea de acento recorre el borde superior y la flecha se
 * desplaza. Toda la tarjeta es un enlace al repositorio.
 *
 * AJUSTES: `stagger(0.08)` = ritmo de la cascada; `card` = movimiento de entrada.
 */
const card = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: EASE },
  },
}

export default function OpenSource() {
  return (
    <section aria-labelledby="mas-github" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <p className="label text-accent">Más en GitHub</p>
            <SplitText
              as="h2"
              text="Laboratorio y código abierto"
              className="mt-6 block font-display text-[clamp(2.4rem,5.5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-bone"
            />
          </div>
          <p className="max-w-md text-base leading-relaxed text-ash md:justify-self-end">
            Visión por computadora, audio, optimización bioinspirada y
            herramientas: proyectos donde experimento y llevo los modelos más
            allá del aula.
          </p>
        </div>
        {/* id en un elemento visible para aria-labelledby */}
        <span id="mas-github" className="sr-only">
          Más proyectos en GitHub
        </span>

        <motion.ul
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ ...viewportOnce, amount: 0.1 }}
          className="mt-14 grid gap-px border border-bone/15 bg-bone/15 md:grid-cols-2 lg:grid-cols-3"
        >
          {moreProjects.map((p) => (
            <motion.li key={p.repo} variants={card} className="bg-ink">
              <article className="group relative flex h-full flex-col p-7 transition-colors duration-500 hover:bg-coal sm:p-8">
                {/* Línea de acento que recorre el borde superior al hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                />

                <p className="label flex items-center justify-between gap-4 text-ash">
                  <span className="text-accent">{p.tag}</span>
                  <span>{p.year}</span>
                </p>

                <h3 className="mt-6 font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-bone">
                  {/* El título es el enlace principal; ::after lo extiende a
                      toda la tarjeta sin anidar enlaces. */}
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                  >
                    {p.name}
                  </a>
                </h3>
                <p className="mt-2 font-serif text-lg italic leading-snug text-bone/70">
                  {p.kind}
                </p>

                <p className="mt-5 flex-1 text-sm leading-relaxed text-ash">{p.summary}</p>

                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {p.stack.map((t) => (
                    <li
                      key={t}
                      className="label rounded-full border border-bone/15 px-2.5 py-1 text-[0.625rem] text-ash"
                    >
                      {t}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex items-center justify-between gap-4 border-t border-bone/10 pt-5">
                  <span className="label flex items-center gap-2 text-bone">
                    <Icons.github className="h-3.5 w-3.5" />
                    Repositorio
                  </span>
                  {p.link ? (
                    // Por encima del enlace extendido (z-10) para ser clicable.
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="label relative z-10 border-b border-accent/50 pb-0.5 text-accent transition-colors hover:border-accent"
                    >
                      Ver en vivo
                    </a>
                  ) : (
                    <Icons.arrowUpRight className="h-4 w-4 text-ash transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" />
                  )}
                </div>
              </article>
            </motion.li>
          ))}

          {/* Tarjeta final: enlace al perfil completo. Además cierra la
              cuadrícula (sin ella, un número impar de proyectos deja un
              hueco). Al hover se rellena con el color de acento. */}
          <motion.li variants={card} className="bg-ink">
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="group relative flex h-full min-h-64 flex-col justify-between overflow-hidden p-7 sm:p-8"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
              />
              <Icons.github className="relative h-8 w-8 text-bone transition-colors duration-500 group-hover:text-ink" />
              <div className="relative">
                <p className="font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-bone transition-colors duration-500 group-hover:text-ink">
                  Ver todo mi GitHub
                </p>
                <p className="label mt-3 flex items-center gap-2 text-ash transition-colors duration-500 group-hover:text-ink/70">
                  github.com/DanieelRC
                  <Icons.arrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </p>
              </div>
            </a>
          </motion.li>
        </motion.ul>
      </div>
    </section>
  )
}
