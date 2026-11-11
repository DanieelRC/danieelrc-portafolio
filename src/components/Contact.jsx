import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionLabel from './ui/SectionLabel'
import SplitText from './ui/SplitText'
import Magnetic from './ui/Magnetic'
import Icons from './ui/Icons'
import { contact, profile } from '../data/content'
import { EASE, fadeUp, stagger, viewportOnce } from '../lib/motion'

/**
 * CONTACTO — apartado para enviar un correo.
 * -----------------------------------------------------------------------------
 * El formulario tiene dos modos y elige solo:
 *
 *  A) ENVÍO DIRECTO A TU BANDEJA (recomendado)
 *     Usa Web3Forms: un servicio gratuito que recibe el formulario y te lo
 *     reenvía por correo, sin backend propio.
 *       1. Entra a https://web3forms.com, escribe tu correo y recibirás una
 *          "access key".
 *       2. Crea un archivo `.env` en la raíz del proyecto con:
 *              VITE_WEB3FORMS_KEY=tu-access-key
 *       3. Reinicia `npm run dev` (o vuelve a hacer el build).
 *     La access key es pública por diseño: solo permite enviar mensajes A TU
 *     correo, por eso puede ir en el código del navegador.
 *
 *  B) SIN CLAVE (modo por defecto)
 *     Abre la aplicación de correo del visitante con destinatario, asunto y
 *     mensaje ya escritos (mailto:). Funciona siempre, sin configurar nada.
 */
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY
const ENDPOINT = 'https://api.web3forms.com/submit'

const EMPTY = { name: '', email: '', subject: '', message: '' }

function validate(data) {
  const errors = {}
  if (!data.name.trim()) errors.name = 'Escribe tu nombre.'
  if (!/^[^ @]+@[^ @]+[.][^ @]+$/.test(data.email.trim()))
    errors.email = 'Escribe un correo válido.'
  if (!data.subject.trim()) errors.subject = 'Agrega un asunto.'
  if (data.message.trim().length < 10)
    errors.message = 'Cuéntame un poco más (mínimo 10 caracteres).'
  return errors
}

function buildMailto(data) {
  const subject = encodeURIComponent(data.subject.trim())
  const body = encodeURIComponent(
    `${data.message.trim()}\n\n—\n${data.name.trim()}\n${data.email.trim()}`,
  )
  return `mailto:${profile.email}?subject=${subject}&body=${body}`
}

export default function Contact() {
  const [data, setData] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  // idle | sending | sent | opened | error
  const [status, setStatus] = useState('idle')
  const [copied, setCopied] = useState(false)

  function update(e) {
    const { name, value } = e.target
    setData((d) => ({ ...d, [name]: value }))
    // El error de un campo desaparece en cuanto el usuario lo corrige.
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget

    const found = validate(data)
    setErrors(found)
    if (Object.keys(found).length) {
      form.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus()
      return
    }

    // Campo trampa: los humanos no lo ven; si viene lleno, es un bot.
    if (form.elements.botcheck?.checked) return

    // --- Modo B: sin clave -> abrir la app de correo del visitante ---
    if (!ACCESS_KEY) {
      const a = document.createElement('a')
      a.href = buildMailto(data)
      document.body.appendChild(a)
      a.click()
      a.remove()
      setStatus('opened')
      return
    }

    // --- Modo A: envío directo vía Web3Forms ---
    setStatus('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: data.name.trim(),
          email: data.email.trim(), // Web3Forms lo usa como "responder a"
          subject: `[Portafolio] ${data.subject.trim()}`,
          message: data.message.trim(),
          from_name: 'Portafolio — formulario de contacto',
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json.success === false) throw new Error('send failed')
      setStatus('sent')
      setData(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Portapapeles bloqueado: el correo sigue visible y seleccionable.
    }
  }

  const directMail = `mailto:${profile.email}?subject=${encodeURIComponent(contact.mailSubject)}`

  return (
    <section id="contacto" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <SectionLabel index="05">{contact.label}</SectionLabel>

        {/* Título gigante, letra por letra */}
        <h2 className="mt-10 font-display text-[clamp(4rem,17vw,16rem)] font-semibold uppercase leading-[0.82] tracking-[-0.05em] text-bone">
          <SplitText text={contact.title} by="char" stagger={0.05} />
          <span className="font-serif font-normal italic text-accent">.</span>
        </h2>

        <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          {/* ============ Columna izquierda: contacto directo ============ */}
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.p
              variants={fadeUp}
              className="max-w-md text-lg leading-relaxed text-ash"
            >
              {contact.blurb}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10">
              <Magnetic strength={0.25}>
                <a
                  href={directMail}
                  className="group inline-flex items-center gap-3 rounded-full bg-accent px-8 py-5 font-display text-base font-semibold text-ink transition-transform duration-300 active:scale-95"
                >
                  <Icons.mail className="h-5 w-5" />
                  Escríbeme un correo
                  <Icons.arrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </Magnetic>
            </motion.div>

            <motion.dl variants={fadeUp} className="mt-12 border-t border-bone/15">
              {/* Correo + copiar */}
              <div className="flex items-center justify-between gap-4 border-b border-bone/15 py-5">
                <div className="min-w-0">
                  <dt className="label text-ash">Correo</dt>
                  <dd className="mt-1.5 truncate font-display text-lg font-medium text-bone">
                    <a href={directMail} className="transition-colors hover:text-accent">
                      {profile.email}
                    </a>
                  </dd>
                </div>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label="Copiar correo al portapapeles"
                  className="label flex shrink-0 items-center gap-2 rounded-full border border-bone/20 px-4 py-2 text-ash transition-colors duration-300 hover:border-accent hover:text-accent"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? 'ok' : 'copy'}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className={`flex items-center gap-2 ${copied ? 'text-accent' : ''}`}
                    >
                      {copied ? (
                        <Icons.check className="h-3.5 w-3.5" />
                      ) : (
                        <Icons.copy className="h-3.5 w-3.5" />
                      )}
                      {copied ? 'Copiado' : 'Copiar'}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>

              <LinkRow label="GitHub" value={`@${profile.githubUser}`} href={profile.github} />
              <LinkRow
                label="LinkedIn"
                value={`/in/${profile.linkedinUser}`}
                href={profile.linkedin}
              />

              <div className="py-5">
                <dt className="label text-ash">Ubicación</dt>
                <dd className="mt-1.5 font-display text-lg font-medium text-bone">
                  {profile.location}
                </dd>
              </div>
            </motion.dl>
          </motion.div>

          {/* ============ Columna derecha: formulario ============ */}
          <motion.form
            onSubmit={handleSubmit}
            noValidate
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="relative border border-bone/15 bg-coal p-7 sm:p-10"
          >
            <p className="label text-ash">Envíame un mensaje</p>

            <div className="mt-8 grid gap-7 sm:grid-cols-2">
              <Field
                name="name"
                label="Nombre"
                autoComplete="name"
                placeholder="Tu nombre"
                value={data.name}
                error={errors.name}
                onChange={update}
              />
              <Field
                name="email"
                type="email"
                label="Tu correo"
                autoComplete="email"
                placeholder="tu@correo.com"
                value={data.email}
                error={errors.email}
                onChange={update}
              />
              <Field
                className="sm:col-span-2"
                name="subject"
                label="Asunto"
                placeholder="¿De qué se trata?"
                value={data.subject}
                error={errors.subject}
                onChange={update}
              />
              <Field
                className="sm:col-span-2"
                as="textarea"
                name="message"
                label="Mensaje"
                placeholder="Cuéntame sobre el proyecto, la vacante o la idea…"
                value={data.message}
                error={errors.message}
                onChange={update}
              />
            </div>

            {/* Trampa anti-bots: invisible y fuera del orden de tabulación. */}
            <input
              type="checkbox"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute h-0 w-0 opacity-0"
            />

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-accent px-8 py-4 font-display text-sm font-semibold text-accent transition-colors duration-500 hover:text-ink active:scale-[0.97] disabled:cursor-wait disabled:opacity-60"
              >
                {/* Relleno que sube al hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                />
                <span className="relative">
                  {status === 'sending' ? 'Enviando…' : 'Enviar correo'}
                </span>
                <Icons.send className="relative h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1" />
              </button>

              <p className="max-w-[26ch] text-xs leading-relaxed text-ash">
                {ACCESS_KEY
                  ? 'Tu mensaje llega directo a mi bandeja de entrada.'
                  : 'Se abrirá tu aplicación de correo con el mensaje listo para enviar.'}
              </p>
            </div>

            {/* Estado del envío. aria-live lo anuncia a lectores de pantalla. */}
            <div aria-live="polite" className="mt-6 min-h-[1.5rem]">
              <AnimatePresence mode="wait">
                {status === 'sent' && (
                  <Status key="sent" tone="ok">
                    Mensaje enviado. Gracias por escribir, te respondo pronto.
                  </Status>
                )}
                {status === 'opened' && (
                  <Status key="opened" tone="ok">
                    Abrí tu aplicación de correo. Si no pasó nada, escríbeme a{' '}
                    {profile.email}.
                  </Status>
                )}
                {status === 'error' && (
                  <Status key="error" tone="error">
                    No se pudo enviar. Escríbeme directo a{' '}
                    <a href={directMail} className="underline">
                      {profile.email}
                    </a>
                    .
                  </Status>
                )}
              </AnimatePresence>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

function LinkRow({ label, value, href }) {
  return (
    <div className="border-b border-bone/15">
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="group flex items-center justify-between gap-4 py-5"
      >
        <div>
          <dt className="label text-ash">{label}</dt>
          <dd className="mt-1.5 font-display text-lg font-medium text-bone transition-colors duration-300 group-hover:text-accent">
            {value}
          </dd>
        </div>
        <Icons.arrowUpRight className="h-5 w-5 text-ash transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" />
      </a>
    </div>
  )
}

/**
 * Campo minimalista: sin caja, solo una línea inferior. Al enfocar, una línea
 * de acento crece de izquierda a derecha; con error, la línea se pone roja.
 */
function Field({ as = 'input', name, label, error, className = '', ...rest }) {
  const Tag = as
  const errorId = `${name}-error`

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={name} className="label text-ash">
        {label}
      </label>
      <div className="relative">
        <Tag
          id={name}
          name={name}
          rows={as === 'textarea' ? 4 : undefined}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`peer w-full resize-none border-0 border-b bg-transparent px-0 py-3 text-base text-bone placeholder:text-bone/25 focus:outline-none ${
            error ? 'border-red-400/70' : 'border-bone/20'
          }`}
          {...rest}
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out peer-focus:scale-x-100"
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="mt-2 text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function Status({ children, tone }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: EASE }}
      className={`flex items-start gap-2.5 text-sm leading-relaxed ${
        tone === 'ok' ? 'text-accent' : 'text-red-400'
      }`}
    >
      {tone === 'ok' && <Icons.check className="mt-0.5 h-4 w-4 shrink-0" />}
      <span>{children}</span>
    </motion.p>
  )
}
