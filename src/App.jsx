import { useCallback, useState } from 'react'
import { MotionConfig, useReducedMotion } from 'framer-motion'
import Preloader from './components/Preloader'
import Cursor from './components/ui/Cursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import VelocityMarquee from './components/VelocityMarquee'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Journey from './components/Journey'
import Contact from './components/Contact'
import Footer from './components/Footer'

/**
 * Composición de la página. El orden de las secciones aquí es el orden en
 * pantalla; si lo cambias, actualiza también `nav` en data/content.js.
 *
 * <MotionConfig reducedMotion="user"> hace que Framer Motion respete la
 * preferencia "reducir movimiento" del sistema en todas las animaciones.
 */

// El preloader se muestra una sola vez por sesión del navegador.
const SEEN_KEY = 'drc:intro-seen'
function introSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false // almacenamiento bloqueado: simplemente se muestra
  }
}

export default function App() {
  const reduce = useReducedMotion()
  const [skipIntro] = useState(() => reduce || introSeen())
  const [ready, setReady] = useState(skipIntro)

  const handleDone = useCallback(() => {
    setReady(true)
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* sin almacenamiento: no pasa nada */
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      {!skipIntro && <Preloader onDone={handleDone} />}
      <Cursor />
      <Navbar />

      <main>
        <Hero ready={ready} />
        <About />
        <VelocityMarquee />
        <Projects />
        <Skills />
        <Journey />
        <Contact />
      </main>

      <Footer />
    </MotionConfig>
  )
}
