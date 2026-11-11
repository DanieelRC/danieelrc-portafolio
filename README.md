# Portafolio — Daniel Rodríguez Carreón

Portafolio personal de estilo cinemático oscuro: tipografía gigante, secciones
fijadas al scroll, proyectos en desplazamiento horizontal y un solo color de
acento.

**Stack:** React 19 · Vite 7 · Tailwind CSS 4 · Framer Motion 12 · simple-icons

## Arranque

```bash
npm install
```

```bash
npm run dev
```

Abre `http://localhost:5173`. Producción: `npm run build` y `npm run preview`.

## Estructura

```
src/
├── App.jsx                    Orden de las secciones + preloader
├── index.css                  ★ TEMA: colores, tipografías, utilidades
├── data/content.js            ★ TODO EL TEXTO (perfil, proyectos, habilidades…)
├── lib/motion.js              ★ Curvas, duraciones y variantes compartidas
└── components/
    ├── Preloader.jsx          Contador 0→100 y telón (una vez por sesión)
    ├── Navbar.jsx             Se oculta al bajar; menú móvil a pantalla completa
    ├── Hero.jsx               Nombre gigante letra por letra + salida con parallax
    ├── NeuralBackground.jsx   Canvas de nodos (se pausa fuera de pantalla)
    ├── About.jsx              Párrafo fijado que se ilumina con el scroll + cifras
    ├── VelocityMarquee.jsx    Cinta gigante que reacciona a la velocidad del scroll
    ├── Projects.jsx           Scroll horizontal fijado (vertical en móvil)
    ├── Skills.jsx             Índice de filas + carrusel de logos
    ├── Journey.jsx            Línea de tiempo que se dibuja con el scroll
    ├── Contact.jsx            Contacto directo + formulario de correo
    ├── Footer.jsx
    └── ui/
        ├── SplitText.jsx          Texto que sube desde una máscara (palabra/letra)
        ├── ScrollRevealText.jsx   Opacidad por palabra ligada al scroll
        ├── Counter.jsx            Contador animado
        ├── Magnetic.jsx           Botón atraído por el cursor
        ├── Cursor.jsx             Punto que sigue al cursor (solo con ratón)
        ├── SectionLabel.jsx       "02 — Proyectos" + línea que se dibuja
        ├── TechLogos.jsx          Logos de marca y glifos propios
        └── Icons.jsx
```

★ = los tres archivos que cubren casi cualquier personalización.

## Formulario de contacto (envío de correo)

El formulario funciona desde el primer momento y tiene dos modos:

| Modo | Cuándo | Qué hace |
| ---- | ------ | -------- |
| **Aplicación de correo** | Por defecto, sin configurar nada | Abre el cliente de correo del visitante con destinatario, asunto y mensaje ya escritos (`mailto:`). |
| **Directo a tu bandeja** | Cuando defines `VITE_WEB3FORMS_KEY` | Envía el mensaje con Web3Forms; te llega a tu correo y al responder le contestas al visitante. |

Para activar el envío directo:

1. Entra a <https://web3forms.com>, escribe tu correo y recibirás una *access key*.
2. Copia `.env.example` como `.env` y pega la clave en `VITE_WEB3FORMS_KEY`.
3. Reinicia `npm run dev`. En un hosting (Vercel, etc.) añade la misma variable
   en su panel de variables de entorno y vuelve a desplegar.

La clave es pública por diseño (solo permite enviar mensajes a tu correo). El
formulario valida los campos, incluye una trampa anti-bots y muestra los
estados enviando / enviado / error.

## Dónde ajustar cada cosa

| Qué | Dónde |
| --- | ----- |
| Textos, proyectos, habilidades, trayectoria | `src/data/content.js` |
| Color de acento (repinta todo, incluido el canvas) | `--color-accent` en `src/index.css` |
| Tipografías | `--font-*` en `src/index.css` + enlace de Google Fonts en `index.html` |
| Ritmo global de las entradas | `DURATION` y `EASE` en `src/lib/motion.js` |
| Duración del preloader | `COUNT_TIME` en `Preloader.jsx` |
| Cuánto scroll tarda en leerse el párrafo de Perfil | `PIN_HEIGHT` en `About.jsx` |
| Velocidad de la cinta gigante | `speed` de cada `<Row>` en `VelocityMarquee.jsx` |
| "Peso" del scroll horizontal de proyectos | spring `smooth` en `Projects.jsx` |
| Velocidad del carrusel de logos | `--animate-marquee` en `src/index.css` |
| Nodos del fondo | objeto `CONFIG` en `NeuralBackground.jsx` |

Énfasis en el párrafo de Perfil: lo que va entre `*asteriscos*` en
`about.statement` se pinta en itálica con el color de acento.

Añadir un logo al carrusel: importa la marca de `simple-icons` en
`ui/TechLogos.jsx`, regístrala en `BRANDS` y añade `{ name, brand }` a
`logoMarquee` en `content.js`. Lo que no existe en el paquete (Azure, MATLAB)
usa un glifo propio de `GLYPHS`.

## Rendimiento

- Las animaciones ligadas al scroll solo tocan `transform` y `opacity`.
- Sin `backdrop-filter` ni desenfoques en elementos que se mueven; sin
  `background-attachment: fixed`.
- El canvas del Hero y la cinta gigante dejan de calcular cuando salen de
  pantalla; el canvas también se pausa con la pestaña en segundo plano.
- El scroll es nativo (no se secuestra): el suavizado se hace con springs.
- El scroll horizontal fijado y el cursor propio se desactivan en móvil/táctil.

## Accesibilidad

- Con `prefers-reduced-motion` no hay preloader, ni secciones fijadas, ni
  parallax: todo el contenido queda visible y estático.
- Los textos partidos en letras exponen el texto completo con `aria-label`.
- El formulario asocia cada error a su campo (`aria-describedby`) y anuncia el
  resultado del envío (`aria-live`).
- `overflow-x: clip` en `body` evita el scroll horizontal sin romper
  `position: sticky`.
