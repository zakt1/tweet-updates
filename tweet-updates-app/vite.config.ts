import { defineConfig } from 'vitest/config'  // Changed from 'vite'import react from '@vitejs/plugin-react'
import path from 'path';
import react from '@vitejs/plugin-react-swc'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: "./setup.ts"
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
