import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useMediaQuery } from '../../lib/motion'

/**
 * <Cursor> — punto que sigue al cursor y crece sobre elementos interactivos.
 *
 * Solo se monta en dispositivos con puntero fino (ratón/trackpad) y sin
 * reduced-motion: en táctil no tiene sentido y sería trabajo desperdiciado.
 * No oculta el cursor nativo: lo acompaña.
 *
 * AJUSTES: tamaño base (h-3 w-3), escala al hover (`scale: 4.5`) y el spring.
 */
export default function Cursor() {
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)')
  const reduce = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })

  const enabled = fine && !reduce

  useEffect(() => {
    if (!enabled) return

    function onMove(e) {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      // ¿Hay un enlace/botón bajo el cursor? (delegación: un solo listener)
      setActive(Boolean(e.target.closest?.('a, button, [data-cursor]')))
    }
    function onLeave() {
      setVisible(false)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[95] mix-blend-difference"
    >
      <motion.div
        animate={{ scale: active ? 4.5 : 1, opacity: visible ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="-ml-1.5 -mt-1.5 h-3 w-3 rounded-full bg-accent"
      />
    </motion.div>
  )
}
