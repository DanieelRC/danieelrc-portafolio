import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Tailwind v4 se integra como plugin de Vite: no hace falta postcss.config.js
// ni tailwind.config.js. Todo el "theme" vive en src/index.css (@theme).
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
