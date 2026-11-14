import { useLayoutEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import SectionLabel from './ui/SectionLabel'
import SplitText from './ui/SplitText'
import Icons from './ui/Icons'
import { projects } from '../data/content'
import { fadeUp, useMediaQuery, viewportOnce } from '../lib/motion'

/**
 * PROYECTOS
 *
 * Escritorio -> SCROLL HORIZONTAL FIJADO. La sección mide (alto de pantalla +
 * ancho sobrante de la pista); su interior es `sticky` y, mientras el usuario
 * baja, la pista se desplaza a la izquierda exactamente los mismos píxeles.
 * 1 px de scroll vertical = 1 px de avance horizontal.
 *
 * Móvil o reduced-motion -> lista vertical normal (fijar el scroll en una
 * pantalla táctil pequeña es incómodo).
 *
 * AJUSTES:
 *  • el spring de `smooth` = cuánto "peso" tiene la pista al seguir el scroll
 *  • ancho/alto de las tarjetas en <ProjectCard> (clases w-[…] y h-[…])
 */
export default function Projects() {
  const desktop = useMediaQuery('(min-width: 768px)')
  const reduce = useReducedMotion()
  return desktop && !reduce ? <HorizontalProjects /> : <VerticalProjects />
}

/* ------------------------------------------------------------------ */
/*  Escritorio: pista horizontal fijada                                */
/* ------------------------------------------------------------------ */
function HorizontalProjects() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  // Píxeles que la pista sobresale del viewport = recorrido horizontal total.
  const distance = useRef(0)
  const [height, setHeight] = useState('100vh')
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    function measure() {
      if (!trackRef.current) return
      distance.current = Math.max(0, trackRef.current.scrollWidth - window.innerWidth)
      setHeight(`calc(100vh + ${distance.current}px)`)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(trackRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  // Spring rígido: quita el escalonado de la rueda del ratón sin dar sensación
  // de retraso. Sube `damping` si lo quieres más pegado al scroll.
  const smooth = useSpring(scrollYProgress, { stiffness: 260, damping: 42, mass: 0.35 })
  const x = useTransform(smooth, (v) => -v * distance.current)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.min(projects.length - 1, Math.floor(v * projects.length)))
  })

  return (
    <section id="proyectos" ref={sectionRef} style={{ height }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Cabecera fija dentro del bloque */}
        <div className="mx-auto flex w-full max-w-[1400px] items-end justify-between px-10 pt-24">
          <SectionLabel index="02" className="flex-1">
            Proyectos
          </SectionLabel>
          <p className="label ml-8 pb-4 tabular-nums text-ash">
            <span className="text-bone">{String(active + 1).padStart(2, '0')}</span> /{' '}
            {String(projects.length).padStart(2, '0')}
          </p>
        </div>

        {/* Pista */}
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max flex-1 items-center gap-6 px-10"
        >
          {/* Panel de introducción */}
          <div className="flex w-[38vw] min-w-[320px] shrink-0 flex-col justify-center pr-10">
            <SplitText
              as="h2"
              text="Trabajo seleccionado"
              className="font-display text-[clamp(2.8rem,6vw,6rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-bone"
            />
            <p className="mt-6 max-w-sm text-base leading-relaxed text-ash">
              Los proyectos más completos: producto, backend, datos e
              integración de modelos de lenguaje, de principio a fin.
            </p>
            <p className="label mt-10 flex items-center gap-3 text-accent">
              Sigue bajando
              <span aria-hidden="true" className="inline-block h-px w-12 bg-accent" />→
            </p>
          </div>

          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              className="h-[min(72vh,620px)] w-[min(88vw,1040px)] shrink-0"
            />
          ))}

          {/* Panel de cierre */}
          <div className="flex w-[34vw] min-w-[300px] shrink-0 flex-col justify-center pl-10">
            <p className="font-display text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-[1] tracking-[-0.03em] text-bone">
              ¿El siguiente es{' '}
              <span className="font-serif font-normal italic text-accent">el tuyo?</span>
            </p>
            <a
              href="#contacto"
              className="label group mt-8 inline-flex w-fit items-center gap-3 rounded-full border border-bone/25 px-6 py-3.5 text-bone transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              Escríbeme
              <Icons.arrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </motion.div>

        {/* Barra de progreso del recorrido */}
        <div className="mx-auto w-full max-w-[1400px] px-10 pb-8">
          <div className="h-px w-full bg-bone/15">
            <motion.div
              style={{ scaleX: smooth }}
              className="h-px origin-left bg-accent"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Móvil / reduced-motion: lista vertical                             */
/* ------------------------------------------------------------------ */
function VerticalProjects() {
  return (
    <section id="proyectos" className="mx-auto max-w-[1400px] px-6 py-24 sm:px-10">
      <SectionLabel index="02">Proyectos</SectionLabel>
      <SplitText
        as="h2"
        text="Trabajo seleccionado"
        className="mt-10 block font-display text-[clamp(2.6rem,11vw,5rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-bone"
      />
      <div className="mt-12 space-y-6">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ ...viewportOnce, amount: 0.15 }}
          >
            <ProjectCard project={project} index={i} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Tarjeta de proyecto (compartida por ambos modos)                   */
/* ------------------------------------------------------------------ */
function ProjectCard({ project, index, className = '' }) {
  return (
    <article
      className={`group relative flex flex-col justify-between gap-8 overflow-hidden border border-bone/15 bg-coal p-7 transition-colors duration-500 hover:border-accent/60 md:grid md:grid-cols-[1fr_1.15fr] md:gap-10 md:p-8 lg:gap-14 lg:p-10 ${className}`}
    >
      {/* Índice fantasma gigante al fondo */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[0.18em] -right-[0.04em] font-display text-[clamp(9rem,22vw,20rem)] font-semibold leading-none tracking-tighter text-bone/[0.04] transition-colors duration-700 group-hover:text-accent/10"
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Columna izquierda: identidad del proyecto */}
      <div className="relative flex flex-col justify-between gap-8">
        <div>
          <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-ash">
            <span className="text-accent">{String(index + 1).padStart(2, '0')}</span>
            <span>{project.period}</span>
          </p>
          <h3 className="mt-5 font-display text-[clamp(2rem,3.6vw,3.5rem)] font-semibold leading-[0.95] tracking-[-0.035em] text-bone">
            {project.name}
          </h3>
          <p className="mt-3 max-w-[30ch] text-base leading-snug text-ash">
            {project.kind}
          </p>
        </div>

        <div>
          <p className="font-serif text-2xl italic leading-tight text-accent sm:text-3xl">
            {project.highlight}
          </p>
          <p className="label mt-3 text-ash">{project.role}</p>
        </div>
      </div>

      {/* Columna derecha: qué se hizo + stack */}
      <div className="relative flex flex-col justify-between gap-8">
        <ul className="space-y-4">
          {project.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex gap-4 text-[0.82rem] leading-relaxed text-bone/80 lg:text-[0.9rem]"
            >
              <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-accent" />
              {bullet}
            </li>
          ))}
        </ul>

        <div>
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="label rounded-full border border-bone/15 px-3 py-1.5 text-ash"
              >
                {tech}
              </li>
            ))}
          </ul>

          {(project.link || project.repo) && (
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              {project.link && (
                <CardLink href={project.link.href}>{project.link.label}</CardLink>
              )}
              {project.repo && (
                <CardLink href={project.repo} icon={Icons.github}>
                  Código en GitHub
                </CardLink>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

/** Enlace pequeño de la tarjeta (demo o repositorio). */
function CardLink({ href, icon: Icon, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="label group/link inline-flex items-center gap-2 text-bone transition-colors duration-300 hover:text-accent"
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      <span className="border-b border-bone/30 pb-0.5 group-hover/link:border-accent">
        {children}
      </span>
      <Icons.arrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
    </a>
  )
}
