import { motion } from 'framer-motion'
import { drawLine, viewportOnce } from '../../lib/motion'

/**
 * Cabecera mínima de sección: "02 — Proyectos" + línea que se dibuja.
 */
export default function SectionLabel({ index, children, className = '' }) {
  return (
    <div className={className}>
      <div className="label flex items-center gap-3 text-ash">
        <span className="text-accent">{index}</span>
        <span aria-hidden="true">—</span>
        <span>{children}</span>
      </div>
      <motion.div
        aria-hidden="true"
        variants={drawLine}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-4 h-px origin-left bg-bone/15"
      />
    </div>
  )
}
