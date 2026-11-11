import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Icons from './ui/Icons'
import { nav, profile } from '../data/content'

/**
 * FOOTER — nombre gigante en contorno que se desliza al llegar al final.
 * AJUSTE: el rango ['-12%', '0%'] es cuánto se desplaza el nombre.
 */
export default function Footer() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end end'],
  })
  const x = useTransform(scrollYProgress, [0, 1], ['-12%', '0%'])

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-bone/15 pt-14">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 px-6 sm:px-10 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-2xl font-semibold tracking-tight text-bone">
            {profile.name}
          </p>
          <p className="label mt-2 text-ash">{profile.role}</p>
        </div>

        <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:flex sm:gap-8">
          {nav.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="label text-ash transition-colors duration-300 hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {[
            { href: profile.github, label: 'GitHub', Icon: Icons.github },
            { href: profile.linkedin, label: 'LinkedIn', Icon: Icons.linkedin },
            { href: `mailto:${profile.email}`, label: 'Correo', Icon: Icons.mail },
          ].map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
              className="rounded-full border border-bone/20 p-3 text-ash transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      {/* Nombre en contorno */}
      <motion.p
        aria-hidden="true"
        style={reduce ? undefined : { x }}
        className="mt-14 select-none whitespace-nowrap font-display text-[clamp(4rem,19vw,19rem)] font-semibold uppercase leading-[0.8] tracking-[-0.05em] text-outline"
      >
        Daniel RC
      </motion.p>

      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 sm:px-10">
        <p className="label text-ash">
          © {new Date().getFullYear()}
        </p>
        <a
          href="#inicio"
          className="label group flex items-center gap-2 text-ash transition-colors duration-300 hover:text-accent"
        >
          Volver arriba
          <Icons.arrowDown className="h-3.5 w-3.5 rotate-180 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </footer>
  )
}
