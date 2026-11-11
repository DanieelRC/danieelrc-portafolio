import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { bigMarquee } from '../data/content'

/**
 * CINTA DE VELOCIDAD
 * Dos filas de texto gigante que se deslizan en sentidos opuestos. Su
 * velocidad se suma a la del scroll, y si subes en vez de bajar, invierten
 * el sentido.
 *
 * Cómo funciona: en cada frame se avanza `baseX` según la velocidad base más
 * un factor derivado de la velocidad del scroll (useVelocity, suavizada con
 * un spring). `baseX` se envuelve en el rango [-25%, 0%] — la pista contiene
 * 4 copias del texto, así que -25% es exactamente una copia y el salto de
 * vuelta es invisible.
 *
 * AJUSTES:
 *  • `speed` de cada <Row>  = velocidad en reposo (% por segundo)
 *  • el rango [0, 1000] -> [0, 4] de `factor` = cuánto acelera el scroll
 */
const COPIES = 4
const wrap = (min, max, v) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

function Row({ speed, outline }) {
  const ref = useRef(null)
  // Fuera de pantalla no se calcula nada.
  const inView = useInView(ref, { margin: '200px 0px' })
  const reduce = useReducedMotion()

  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false })
  const direction = useRef(1)

  const x = useTransform(baseX, (v) => `${wrap(-100 / COPIES, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (!inView || reduce) return
    const f = factor.get()
    if (f < 0) direction.current = -1
    else if (f > 0) direction.current = 1

    let move = direction.current * speed * (delta / 1000)
    move += direction.current * move * Math.abs(f)
    baseX.set(baseX.get() + move)
  })

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div style={{ x }} className="flex w-max whitespace-nowrap">
        {Array.from({ length: COPIES }, (_, c) => (
          <div key={c} aria-hidden={c > 0 ? 'true' : undefined} className="flex shrink-0">
            {bigMarquee.map((word, i) => (
              <span
                key={word}
                className={`flex items-center font-display text-[clamp(3rem,9vw,8.5rem)] font-semibold uppercase leading-none tracking-[-0.04em] ${
                  // Alterna relleno y contorno; la fila inferior va invertida.
                  (i % 2 === 0) !== outline ? 'text-bone' : 'text-outline'
                }`}
              >
                <span className="px-[0.18em]">{word}</span>
                <span aria-hidden="true" className="text-[0.4em] text-accent">
                  ✦
                </span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function VelocityMarquee() {
  return (
    <section
      aria-label="Áreas de trabajo"
      className="border-y border-bone/15 py-8 sm:py-12"
    >
      <Row speed={-1.6} outline={false} />
      <Row speed={1.6} outline />
    </section>
  )
}
