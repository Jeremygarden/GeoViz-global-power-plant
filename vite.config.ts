import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/')
          ) {
            return 'vendor-react'
          }
          if (
            id.includes('/node_modules/maplibre-gl/') ||
            id.includes('/node_modules/react-map-gl/')
          ) {
            return 'vendor-map'
          }
          if (
            id.includes('/node_modules/deck.gl/') ||
            id.includes('/node_modules/@deck.gl/core/') ||
            id.includes('/node_modules/@deck.gl/layers/') ||
            id.includes('/node_modules/@deck.gl/aggregation-layers/') ||
            id.includes('/node_modules/@deck.gl/react/')
          ) {
            return 'vendor-deck'
          }
          if (id.includes('/node_modules/d3/')) {
            return 'vendor-d3'
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
})
