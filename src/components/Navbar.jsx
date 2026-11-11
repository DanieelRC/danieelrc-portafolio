import { useEffect, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from 'framer-motion'
import { nav, profile } from '../data/content'
import { EASE, EASE_INOUT } from '../lib/motion'

/**
 * NAVBAR
 *  • Se OCULTA al bajar y REAPARECE al subir (deja la pantalla limpia para
 *    las secciones fijadas). Umbral: HIDE_AFTER px.
 *  • Barra de progreso de lectura en el borde superior.
 *  • En móvil: menú a pantalla completa con enlaces gigantes en cascada.
 */
const HIDE_AFTER = 160

export default function Navbar() {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > HIDE_AFTER)
    setScrolled(y > 40)
  })

  // Con el menú abierto no debe poder desplazarse la página de fondo.
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <motion.header
        animate={{ y: hidden && !open ? '-100%' : '0%' }}
        transition={{ duration: 0.5, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled && !open ? 'bg-ink/90' : 'bg-transparent'
        }`}
      >
        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="h-0.5 origin-left bg-accent"
        />

        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 sm:px-10">
          <a
            href="#inicio"
            onClick={() => setOpen(false)}
            className="font-display text-lg font-semibold tracking-tight text-bone"
            aria-label="Ir al inicio"
          >
            {profile.initials}
            <span className="text-accent">.</span>
          </a>

          {/* Enlaces de escritorio: subrayado que crece desde la izquierda */}
          <ul className="hidden items-center gap-8 md:flex">
            {nav.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="label group relative py-2 text-ash transition-colors duration-300 hover:text-bone"
                >
                  {link.label}
                  <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movil"
            className="label rounded-full border border-bone/20 px-4 py-2 text-bone md:hidden"
          >
            {open ? 'Cerrar' : 'Menú'}
          </button>
        </nav>
      </motion.header>

      {/* Menú móvil: telón que baja + enlaces que suben en cascada */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            initial={{ y: '-100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.7, ease: EASE_INOUT }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-6 pb-10 pt-28 md:hidden"
          >
            <ul className="space-y-2">
              {nav.map((link, i) => (
                <li key={link.href} className="overflow-hidden">
                  <motion.a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.07 }}
                    className="flex items-baseline gap-4 font-display text-5xl font-semibold tracking-tight text-bone"
                  >
                    <span className="label text-accent">0{i + 1}</span>
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>

            <div className="label space-y-2 text-ash">
              <a href={`mailto:${profile.email}`} className="block text-bone">
                {profile.email}
              </a>
              <p>{profile.location}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
