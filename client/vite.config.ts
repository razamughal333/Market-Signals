import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // lets the frontend call "/api/..." during local dev without CORS headaches —
      // Vite forwards it to your Express server on port 5000
      '/api': 'http://localhost:5000',
    },
  },
})
