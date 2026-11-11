import { useEffect, useState } from 'react'
import { AnimatePresence, animate, motion } from 'framer-motion'
import { profile } from '../data/content'
import { EASE_INOUT } from '../lib/motion'

/**
 * PRELOADER — contador 0→100 y telón que sube.
 *
 * Es una entrada, no una carga real: dura lo mismo siempre y solo se muestra
 * una vez por sesión del navegador (App.jsx lo decide con sessionStorage).
 *
 * AJUSTES:
 *  • COUNT_TIME   segundos que tarda el contador
 *  • la transición `exit` controla la velocidad del telón
 *
 * `onDone` se llama cuando el contador termina (justo al empezar a subir el
 * telón), para que el Hero empiece a animar mientras se descubre.
 */
const COUNT_TIME = 1.3

export default function Preloader({ onDone }) {
  const [count, setCount] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    // Bloquea el scroll mientras el telón cubre la página.
    document.documentElement.style.overflow = 'hidden'

    const controls = animate(0, 100, {
      duration: COUNT_TIME,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        setShow(false)
        onDone?.()
      },
    })

    return () => {
      controls.stop()
      document.documentElement.style.overflow = ''
    }
  }, [onDone])

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.style.overflow = ''
      }}
    >
      {show && (
        <motion.div
          key="preloader"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: EASE_INOUT }}
          className="fixed inset-0 z-[200] flex flex-col justify-between bg-ink p-6 sm:p-10"
        >
          <div className="label flex justify-between text-ash">
            <span>{profile.name}</span>
            <span>Portafolio</span>
          </div>

          <div className="flex items-end justify-between">
            <span className="label text-ash">Cargando</span>
            <span className="font-display text-[clamp(5rem,22vw,16rem)] font-semibold leading-[0.8] tracking-tighter text-bone tabular-nums">
              {count}
            </span>
          </div>

          {/* Barra de progreso en el borde inferior */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1 origin-left bg-accent"
            style={{ transform: `scaleX(${count / 100})` }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
