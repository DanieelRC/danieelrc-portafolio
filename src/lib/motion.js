import { useEffect, useState } from 'react'

/**
 * AJUSTES DE ANIMACIÓN COMPARTIDOS
 * -----------------------------------------------------------------------------
 *  • Ritmo global de las entradas -> DURATION
 *  • Carácter del frenado          -> EASE (expo-out: arranca rápido, frena suave)
 *  • Curva de cortinas/telones     -> EASE_INOUT
 *  • Distancia del slide-up        -> DISTANCE
 */
export const DURATION = 0.9
export const DISTANCE = 32
export const EASE = [0.16, 1, 0.3, 1]
export const EASE_INOUT = [0.76, 0, 0.24, 1]

/** Aparición desde abajo (bloques de contenido). */
export const fadeUp = {
  hidden: { opacity: 0, y: DISTANCE },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION, ease: EASE },
  },
}

/** Texto que sube desde detrás de una máscara (ver ui/SplitText.jsx). */
export const maskUp = {
  hidden: { y: '115%' },
  visible: { y: '0%', transition: { duration: DURATION, ease: EASE } },
}

/** Línea que se dibuja de izquierda a derecha. */
export const drawLine = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1.2, ease: EASE } },
}

/** Contenedor que dispara a sus hijos en cascada. */
export const stagger = (each = 0.08, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: each, delayChildren: delay } },
})

/** `amount` = fracción visible antes de animar. `once` = no repetir. */
export const viewportOnce = { once: true, amount: 0.3 }

/** Spring corto para micro-interacciones (hover, tap). */
export const snappy = { type: 'spring', stiffness: 400, damping: 28 }

/**
 * Media query reactiva. Se usa para decidir entre el scroll horizontal fijado
 * (escritorio) y la lista vertical (móvil), y para activar el cursor propio.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}
