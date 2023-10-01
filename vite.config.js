import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  publicDir: './public',
  optimizeDeps: {
    exclude: []
  },
  // build: {
  //   // generate manifest.json in outDir
  //   manifest: true,
  //   rollupOptions: {
  //     // overwrite default .html entry
  //     input: '/path/to/main.js',
  //   },
  // },
})
