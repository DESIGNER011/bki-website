import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Toggle this to `false` when Firebase API keys are available in .env
const USE_LOCAL_MOCK = true;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: USE_LOCAL_MOCK ? [
      { find: /.*\/services\/dbService/, replacement: path.resolve(__dirname, './src/services/localDbService.js') },
      { find: /.*\/services\/authService/, replacement: path.resolve(__dirname, './src/services/localAuthService.js') },
      { find: /.*\/services\/storageService/, replacement: path.resolve(__dirname, './src/services/localStorageService.js') }
    ] : []
  },
})
