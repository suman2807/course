import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure assets are loaded from the correct path
  build: {
    // Generate sourcemaps for better debugging
    sourcemap: true,
    // Output directory
    outDir: 'dist',
    // Ensure index.html handles all routes (for SPA)
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})