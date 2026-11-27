import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: { output: { manualChunks: (id: string) => (id.includes('framer-motion') || id.includes('motion-dom') ? 'motion' : id.includes('node_modules') ? 'vendor' : undefined) } },
  },
})
