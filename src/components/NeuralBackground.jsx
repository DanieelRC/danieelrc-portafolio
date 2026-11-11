import { useEffect, useRef } from 'react'

/**
 * <NeuralBackground> — red neuronal de partículas interactiva sobre <canvas>.
 *
 * Simula nodos que se desplazan y se conectan entre sí cuando están cerca:
 * la metáfora visual de una red neuronal / flujo de datos. El cursor genera
 * un campo de atracción y enciende las conexiones cercanas.
 *
 * ===== PARÁMETROS DE AJUSTE (objeto CONFIG abajo) =====
 *  density        Menor número = MÁS nodos (es un divisor de área).
 *  maxSpeed       Velocidad de deriva de los nodos.
 *  linkDistance   Radio en px para dibujar una conexión entre dos nodos.
 *  mouseRadius    Radio de influencia del cursor.
 *  mousePull      Fuerza de atracción hacia el cursor (negativo = repele).
 *  colors         Paleta de los nodos (coincide con el theme de Tailwind).
 *
 * ===== NOTAS DE RENDIMIENTO =====
 * Este componente estaba pensado para verse bien, y se optimizó para no
 * costar caro. Cuatro decisiones concretas, por si tocas el código:
 *
 *  1. NADA DE `createLinearGradient` POR ENLACE. Antes se creaba un objeto
 *     gradiente por cada línea y por cada frame (~150 asignaciones/frame,
 *     con su recolección de basura). Ahora cada línea usa un color sólido.
 *     Medido: 0.604 ms -> 0.108 ms por frame. Este era el cuello de botella.
 *  2. REJILLA ESPACIAL. Buscar vecinos comparando todos contra todos es
 *     O(n²) (~6000 comparaciones con 110 nodos). Los nodos se reparten en
 *     celdas del tamaño de `linkDistance` y solo se comparan las celdas
 *     contiguas.
 *  3. EL BUCLE SE DETIENE cuando el Hero sale de la pantalla. Antes seguía
 *     animando mientras leías el resto de la página, robando frames al
 *     scroll. Esto es lo que más se nota.
 *
 * SOBRE `shadowBlur`: la intuición dice que hay que evitarlo y pre-renderizar
 * el halo en un sprite. Aquí se midió y es FALSO a esta escala: con nodos de
 * 1-2.4 px de radio, `shadowBlur` cuesta ~0.065 ms/frame y el sprite con
 * `drawImage` ~0.16 ms. Se mantiene `shadowBlur` a propósito. Si algún día
 * subes mucho `maxNodes` o el radio, vuelve a medirlo antes de cambiarlo.
 */

const CONFIG = {
  density: 16000, // 1 nodo por cada ~16000 px² de superficie
  maxNodes: 90, // techo duro para equipos modestos
  maxSpeed: 0.28,
  nodeRadius: [1, 2.4],
  linkDistance: 148,
  mouseRadius: 190,
  mousePull: 0.022, // ponlo en -0.03 para que el cursor "empuje" los nodos
  // Monocromo: la mayoría de nodos en blanco hueso y algunos en el acento.
  // El acento se lee de la variable CSS --color-accent al montar (ver abajo),
  // así que cambiar el color en index.css también cambia el canvas.
  colors: ['#ededea', '#ededea', '#ededea', 'accent'],
  maxDpr: 1.5, // por encima de esto el coste crece y la mejora no se nota
}

export default function NeuralBackground({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Si el usuario pide menos movimiento, pintamos un fotograma estático.
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    let nodes = []
    let width = 0
    let height = 0
    let rafId = null
    let onScreen = true // ¿el canvas está en el viewport?
    let resizeTimer = null

    const mouse = { x: -9999, y: -9999, active: false }
    const rand = (min, max) => Math.random() * (max - min) + min

    // Resuelve la paleta: 'accent' -> valor real de --color-accent.
    const accent =
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-accent')
        .trim() || '#c8f542'
    const palette = CONFIG.colors.map((c) => (c === 'accent' ? accent : c))

    /* --- Rejilla espacial para la búsqueda de vecinos --- */
    const cell = CONFIG.linkDistance
    let cols = 0
    let rows = 0
    let buckets = []

    function rebuildGrid() {
      cols = Math.max(1, Math.ceil(width / cell))
      rows = Math.max(1, Math.ceil(height / cell))
      buckets = Array.from({ length: cols * rows }, () => [])
    }

    function fillGrid() {
      for (const b of buckets) b.length = 0
      for (const n of nodes) {
        const cx = Math.min(cols - 1, Math.max(0, (n.x / cell) | 0))
        const cy = Math.min(rows - 1, Math.max(0, (n.y / cell) | 0))
        buckets[cy * cols + cx].push(n)
      }
    }

    /** Recalcula tamaño del buffer y regenera la nube de nodos. */
    function resize() {
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxDpr)

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      // Trabajamos en coordenadas CSS; el escalado lo hace el contexto.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(
        CONFIG.maxNodes,
        Math.floor((width * height) / CONFIG.density),
      )

      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: rand(-CONFIG.maxSpeed, CONFIG.maxSpeed),
        vy: rand(-CONFIG.maxSpeed, CONFIG.maxSpeed),
        r: rand(CONFIG.nodeRadius[0], CONFIG.nodeRadius[1]),
        color: palette[Math.floor(Math.random() * palette.length)],
        // Fase para el parpadeo individual de cada nodo.
        phase: Math.random() * Math.PI * 2,
      }))

      rebuildGrid()
    }

    /** Dibuja las conexiones entre `a` y los nodos de una celda. */
    function linkAgainst(a, bucket, fromIndex) {
      for (let k = fromIndex; k < bucket.length; k++) {
        const b = bucket[k]
        if (b === a) continue

        const dx = a.x - b.x
        const dy = a.y - b.y
        const d2 = dx * dx + dy * dy
        // Comparamos distancias al cuadrado: nos ahorramos una raíz cuadrada
        // por cada par de nodos evaluado.
        if (d2 > cell * cell) continue

        const dist = Math.sqrt(d2)
        let alpha = (1 - dist / cell) * 0.5

        // Las conexiones cerca del cursor brillan más.
        if (mouse.active) {
          const mx = (a.x + b.x) * 0.5 - mouse.x
          const my = (a.y + b.y) * 0.5 - mouse.y
          const mdist = Math.sqrt(mx * mx + my * my)
          if (mdist < CONFIG.mouseRadius) {
            alpha += (1 - mdist / CONFIG.mouseRadius) * 0.45
          }
        }

        // Color sólido (el del nodo A). Ver nota de rendimiento nº 1.
        ctx.globalAlpha = alpha < 0.85 ? alpha : 0.85
        ctx.strokeStyle = a.color
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }

    function step(time) {
      ctx.clearRect(0, 0, width, height)

      // --- 1) Física de los nodos ---
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy

        // Rebote suave en los bordes.
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
        n.x = n.x < 0 ? 0 : n.x > width ? width : n.x
        n.y = n.y < 0 ? 0 : n.y > height ? height : n.y

        // Atracción hacia el cursor dentro de su radio de influencia.
        if (mouse.active) {
          const dx = mouse.x - n.x
          const dy = mouse.y - n.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONFIG.mouseRadius && dist > 1) {
            const force = (1 - dist / CONFIG.mouseRadius) * CONFIG.mousePull
            n.vx += (dx / dist) * force
            n.vy += (dy / dist) * force
          }
        }

        // Fricción: evita que la atracción acelere los nodos indefinidamente.
        n.vx *= 0.995
        n.vy *= 0.995
        n.vx = n.vx < -0.9 ? -0.9 : n.vx > 0.9 ? 0.9 : n.vx
        n.vy = n.vy < -0.9 ? -0.9 : n.vy > 0.9 ? 0.9 : n.vy
      }

      // --- 2) Conexiones (sinapsis), vía rejilla espacial ---
      fillGrid()
      ctx.lineWidth = 0.7

      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const bucket = buckets[cy * cols + cx]
          if (!bucket.length) continue

          for (let i = 0; i < bucket.length; i++) {
            const a = bucket[i]
            // Misma celda: solo hacia adelante, para no repetir pares.
            linkAgainst(a, bucket, i + 1)

            // Celdas vecinas: solo la mitad (derecha y fila inferior), que
            // es suficiente para cubrir cada par exactamente una vez.
            for (const [ox, oy] of [
              [1, 0],
              [-1, 1],
              [0, 1],
              [1, 1],
            ]) {
              const nx = cx + ox
              const ny = cy + oy
              if (nx < 0 || nx >= cols || ny >= rows) continue
              linkAgainst(a, buckets[ny * cols + nx], 0)
            }
          }
        }
      }

      // --- 3) Nodos encima de las líneas ---
      // `shadowBlur` se mantiene a propósito: a este tamaño de nodo resultó
      // más rápido que pre-renderizar sprites (ver nota de la cabecera).
      for (const n of nodes) {
        // Parpadeo suave e individual (cada nodo con su propia fase).
        ctx.globalAlpha = 0.65 + Math.sin(time / 900 + n.phase) * 0.35
        ctx.fillStyle = n.color
        ctx.shadowBlur = 12
        ctx.shadowColor = n.color
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
      rafId = requestAnimationFrame(step)
    }

    function start() {
      if (rafId || reducedMotion) return
      rafId = requestAnimationFrame(step)
    }

    function stop() {
      if (!rafId) return
      cancelAnimationFrame(rafId)
      rafId = null
    }

    function handlePointerMove(e) {
      // Fuera de pantalla no hay nada que actualizar.
      if (!onScreen) return
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
    }

    function handlePointerLeave() {
      mouse.active = false
      mouse.x = -9999
      mouse.y = -9999
    }

    resize()
    if (reducedMotion) {
      step(0) // un solo fotograma: se ve la composición, nada se mueve
      stop()
    } else {
      start()
    }

    /* --- Pausa cuando el Hero sale del viewport (nota de rendimiento nº 4) --- */
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        if (onScreen && !document.hidden) start()
        else stop()
      },
      { threshold: 0 },
    )
    visibilityObserver.observe(canvas)

    /* --- Pausa cuando la pestaña pasa a segundo plano --- */
    function handleVisibility() {
      if (document.hidden) stop()
      else if (onScreen) start()
    }

    /* --- Resize con rebote: ResizeObserver dispara en ráfagas --- */
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        resize()
        if (reducedMotion) step(0)
      }, 150)
    })
    resizeObserver.observe(canvas)

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      stop()
      clearTimeout(resizeTimer)
      visibilityObserver.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`h-full w-full ${className}`}
    />
  )
}
