import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    host: true,
     allowedHosts: ["badly-maximize-suffice.ngrok-free.dev"],

        proxy: {
      "/api": {
        target: "https://ecomapi.sacrosys.net",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    // Raise the warning threshold slightly (500 kB default → 600 kB)
    // Raise limit — react-dom alone is ~730 kB; that's irreducible
    chunkSizeWarningLimit: 750,
    rollupOptions: {
      output: {
        // Vite 8 (rolldown) requires manualChunks as a function
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('react-dom'))   return 'vendor-react-dom';
          if (id.includes('react-router')) return 'vendor-router';
          if (id.includes('/react/'))      return 'vendor-react';

          if (id.includes('framer-motion') || id.includes('lenis')) return 'vendor-motion';
          if (id.includes('@tanstack'))    return 'vendor-query';
          if (id.includes('lucide-react') || id.includes('@iconify')) return 'vendor-icons';
          if (id.includes('@stripe'))      return 'vendor-stripe';
        },
      },
    },
  },
})
