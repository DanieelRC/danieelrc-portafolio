import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'
import { EASE } from '../../lib/motion'

/**
 * <Counter to={5} /> — cuenta de 0 al valor cuando entra en pantalla.
 * Escribe directo en el DOM (ref) para no re-renderizar React en cada frame.
 * AJUSTE: `duration` en segundos.
 */
export default function Counter({ to, duration = 1.6, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!inView || !ref.current) return
    if (reduce) {
      ref.current.textContent = String(to)
      return
    }
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = String(Math.round(v))
      },
    })
    return () => controls.stop()
  }, [inView, to, duration, reduce])

  return (
    <span ref={ref} className={className}>
      0
    </span>
  )
}
