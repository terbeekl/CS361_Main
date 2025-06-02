import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['54e5-2601-1c0-8081-9de0-6128-a1de-895b-90d4.ngrok-free.app'],
  },
})
