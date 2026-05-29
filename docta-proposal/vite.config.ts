import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Parent dir has a postcss.config that references @tailwindcss/postcss; we
  // use the Vite plugin instead, so disable PostCSS config discovery.
  css: {
    postcss: {},
  },
})
