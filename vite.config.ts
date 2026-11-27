import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { readFileSync } from 'node:fs'

const version = JSON.parse(readFileSync('./package.json', 'utf8')).version

export default defineConfig({
  base: './',
  define: { __APP_VERSION__: JSON.stringify(version) },
  plugins: [react(), { name: 'html-version', transformIndexHtml: (h: string) => h.replace('%APP_VERSION%', version) }],
  build: {
    rollupOptions: { output: { manualChunks: (id: string) => (id.includes('framer-motion') || id.includes('motion-dom') ? 'motion' : id.includes('node_modules') ? 'vendor' : undefined) } },
  },
})
