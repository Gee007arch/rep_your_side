import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 5173,
    fs: {
      allow: ['..']
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            return 'vendor';
          }
          if (id.includes('/src/data/')) {
            return 'data-catalog';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
  test: {
    exclude: ['node_modules/**', 'dist/**', 'tests/e2e/**']
  }
});
