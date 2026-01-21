import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs', // This will help with Tailwind processing
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'data-vendor': ['@tanstack/react-query', 'zod'],
          'chart-vendor': ['recharts'],
          'i18n-vendor': ['i18next', 'react-i18next'],
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true,
  },
  define: {
    global: 'globalThis',
  },
})